import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {CityOutput, HumanOutput} from '../../../api/model/models';
import {CityService} from '../../city.service';
import {Subscription} from 'rxjs';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {EventItemComponent, EventType} from '../../../shared/components/event-item/event-item.component';
import {EntityPanelComponent, EntityData} from '../../../shared/components/entity-panel/entity-panel.component';
import {SimulationsService} from '../../../api/api/simulations.service';

// PixiJS types - will be dynamically imported
type PIXI = typeof import('pixi.js');
type PIXIApplication = import('pixi.js').Application;
type PIXIText = import('pixi.js').Text;
type PIXITextStyle = import('pixi.js').TextStyle;

interface HumanSprite {
  human: HumanOutput,
  sprite: PIXIText,
  hasCollision?: boolean,
  targetX?: number,
  targetY?: number
}


@Component({
  selector: 'app-city-details',
  templateUrl: './city-details.page.html',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    EventItemComponent,
    EntityPanelComponent
  ],
  styleUrl: './city-details.page.scss'
})
export class CityDetailsPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('container', {static: true}) containerRef!: ElementRef<HTMLDivElement>;
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute)
  public city: CityOutput = this.route.snapshot.data['city'];
  private service: CityService = inject(CityService);
  private simulationService = inject(SimulationsService);
  private app!: PIXIApplication;
  private pixiLib!: PIXI;
  private humanWithStripes = signal<HumanSprite[]>([]);
  private isFirstSubscription = true;
  private subscription?: Subscription;
  private pendingHumans: HumanOutput[] = []; // Queue for humans received before PixiJS is ready

  // UI State
  isRunning = signal(false);
  cycle = signal(247);
  population = signal(12847);
  happiness = signal(87);
  resources = signal('$45.2K');
  
  recentEvents = signal<Array<{
    id: number;
    title: string;
    description: string;
    timestamp: string;
    type: EventType;
  }>>([
    {
      id: 1,
      title: 'New citizen born',
      description: 'Sarah Johnson arrived in the city',
      timestamp: '2 minutes ago',
      type: 'birth'
    },
    {
      id: 2,
      title: 'Building completed',
      description: 'New residential complex finished',
      timestamp: '15 minutes ago',
      type: 'building'
    },
    {
      id: 3,
      title: 'New invention',
      description: 'Steam engine discovered by engineers',
      timestamp: '1 hour ago',
      type: 'invention'
    }
  ]);

  selectedEntity = signal<EntityData | null>({
    name: 'City Hall',
    type: 'Government Building',
    icon: 'business',
    iconColor: '#3b82f6',
    status: 'Active',
    level: 3,
    capacity: { current: 45, max: 50 },
    efficiency: 82,
    workers: 12,
    maintenanceCost: '$250/cycle',
    builtAt: 'Cycle 12'
  });

  ngOnInit() {
    this.subscription = this.service.subscribePositions(String(this.city.id!)).subscribe({
      next: humans => {
        humans.forEach(human => {
          if (!this.humanWithStripes().find(h => h.human.id === human.id)) {
            // Only create if app is ready, otherwise queue it
            if (this.app && this.app.screen) {
              this.createHuman(human);
            } else {
              // Queue for later creation
              if (!this.pendingHumans.find(h => h.id === human.id)) {
                this.pendingHumans.push(human);
              }
            }
          } else {
            this.animateHuman(human);
          }
        })

      },
      error: (error) => {
        // Handle subscription error silently or log to error tracking service
      }
    });

  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.createPixiApp();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    if (this.app) {
      // Clean up sprites before destroying the app
      this.humanWithStripes().forEach(human => {
        if (human.sprite && !human.sprite.destroyed) {
          // Remove from stage first
          if (human.sprite.parent) {
            human.sprite.parent.removeChild(human.sprite);
          }
          // Then destroy
          human.sprite.destroy({ children: true });
        }
      });
      this.humanWithStripes.set([]);

      // Destroy the PIXI application
      this.app.destroy(true, { children: true });
    }
  }

  handleCollision = (a: HumanSprite, b: HumanSprite) => {
    a.hasCollision = true;
    b.hasCollision = true;
    /*const g = new PIXI.Graphics();
    g.circle(a.sprite.x, a.sprite.y, 8).stroke({color: 0xff0000});
    this.app.stage.addChild(g);
    setTimeout(() => g.destroy(), 1000); // remove after 100ms*/
  };

  private async createPixiApp(): Promise<void> {
    try {
      // Dynamically import PixiJS only in browser
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      this.pixiLib = await import('pixi.js');
      const PIXI = this.pixiLib;

      // Initialize PIXI Application
      this.app = new PIXI.Application();

      // Wait for the app to be ready
      await this.app.init({
        width: this.containerRef.nativeElement.clientWidth,
        height: this.containerRef.nativeElement.clientHeight,
        backgroundColor: 0x0f172a, // RGB equivalent of rgba(15, 23, 42, 0.85)
        backgroundAlpha: 0.85, // Enable transparency
        resolution: window.devicePixelRatio || 1,
        antialias: true,
      });

      // Add the canvas to the DOM
      this.containerRef.nativeElement.appendChild(this.app.canvas as HTMLCanvasElement);
      this.handleResize();

      this.app.ticker.add(() => {
        const speed = 0.1;
        this.humanWithStripes().forEach((h) => {
          if (!h.hasCollision) {
            const targetX = h.targetX ?? h.sprite.x;
            const targetY = h.targetY ?? h.sprite.y;
            h.sprite.x += (targetX - h.sprite.x) * speed;
            h.sprite.y += (targetY - h.sprite.y) * speed;
          }

        });

        this.detectCollisions();
      });

      // Process any pending humans that arrived before PixiJS was ready
      this.pendingHumans.forEach(human => {
        if (!this.humanWithStripes().find(h => h.human.id === human.id)) {
          this.createHuman(human);
        }
      });
      this.pendingHumans = [];

    } catch (error) {
      // Handle PIXI initialization error silently or log to error tracking service
    }
  }

  private createHuman(human: HumanOutput): void {
    // Ensure app is initialized and screen is available
    if (!this.app || !this.app.screen || !this.pixiLib) {
      return;
    }

    const PIXI = this.pixiLib;

    // Choose face emoticon based on dominant personality trait
    const emoticon = this.getPersonalityFace(human);

    // Create text sprite for the emoticon using PixiJS v8+ API
    const style = new PIXI.TextStyle({
      fontSize: 18,
      // fill: this.getPersonalityColor(human),
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif' // Ensure emoji support
    });

    const text = new PIXI.Text({ text: emoticon, style });
    text.anchor.set(0.5); // Center the emoticon
    text.x = (human.x ?? 0) * this.app.screen.width;
    text.y = (human.y ?? 0) * this.app.screen.height;

    // Add interactive behavior
    text.eventMode = 'static';
    text.cursor = 'pointer';

    let originalScale = 1;
    text.on('pointerover', () => {
      originalScale = text.scale.x;
      text.scale.set(originalScale * 1.3); // Pop effect on hover
    });

    text.on('pointerout', () => {
      text.scale.set(originalScale);
    });

    /*text.on('pointerdown', () => {
      this.showHumanInfo(human, text);
    });*/

    this.app.stage.addChild(text);
    this.humanWithStripes().push({human, sprite: text});
  }

  private getPersonalityFace(human: HumanOutput): string {
    const traits = [
      {name: 'CREATIVE', value: human.creativity ?? 0, face: '🤔'},      // Thinking/creative face
      {name: 'INTELLECTUAL', value: human.intellect ?? 0, face: '🧐'},   // Monocle face - analytical
      {name: 'SOCIABLE', value: human.sociability ?? 0, face: '😊'},     // Happy/smiling face
      {name: 'PRACTICAL', value: human.practicality ?? 0, face: '😐'}    // Neutral/practical face
    ];

    // Find dominant trait
    const dominant = traits.reduce((prev, current) =>
      (prev.value > current.value) ? prev : current
    );

    return dominant.face;
  }

  private animateHuman(human: HumanOutput): void {
    // Ensure app is initialized and screen is available
    if (!this.app || !this.app.screen) {
      return;
    }

    const existingHuman = this.humanWithStripes().find(h => h.human.id === human.id);
    if (existingHuman) {
      existingHuman.targetX = (human.x ?? 0) * this.app.screen.width;
      existingHuman.targetY = (human.y ?? 0) * this.app.screen.height;
    }

    this.humanWithStripes.update(humanWithSprites => {
      const humanSprite = humanWithSprites.find(hs => hs.human.id === human.id);
      if (humanSprite) {
        humanSprite.human = human;
      }
      return humanWithSprites;
    });
  }

  private detectCollisions(): void {
    const humans = this.humanWithStripes();

    for (let i = 0; i < humans.length; i++) {
      const a = humans[i];
      for (let j = i + 1; j < humans.length; j++) {
        const b = humans[j];

        const dx = a.sprite.x - b.sprite.x;
        const dy = a.sprite.y - b.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const minDist = 10; // radius * 2 (you drew radius=5)
        if (distance < minDist) {
          // 💥 Collision detected!
          // this.handleCollision(a, b);
        }
      }
    }
  }

  private handleResize(): void {
    const resizeObserver = new ResizeObserver(() => {
      this.app?.renderer?.resize(
        this.containerRef.nativeElement.clientWidth,
        this.containerRef.nativeElement.clientHeight
      );

    });

    resizeObserver.observe(this.containerRef.nativeElement);
  }

  // Simulation Controls
  onStart(): void {
    if (this.city.id) {
      this.simulationService.startSimulation(this.city.id).subscribe({
        next: () => {
          this.isRunning.set(true);
          this.checkSimulationStatus();
        },
        error: (error) => {
          console.error('Error starting simulation:', error);
        }
      });
    }
  }

  onPause(): void {
    if (this.city.id) {
      this.simulationService.stopSimulation(this.city.id).subscribe({
        next: () => {
          this.isRunning.set(false);
        },
        error: (error) => {
          console.error('Error stopping simulation:', error);
        }
      });
    }
  }

  onStep(steps: number): void {
    // TODO: Implement step functionality
    console.log(`Step ${steps} cycles`);
  }

  checkSimulationStatus(): void {
    if (this.city.id) {
      this.simulationService.isSimulationRunning(this.city.id).subscribe({
        next: (response: any) => {
          this.isRunning.set(response.running || false);
        },
        error: (error) => {
          console.error('Error checking simulation status:', error);
        }
      });
    }
  }

  onViewEntityDetails(): void {
    // TODO: Navigate to entity details or open dialog
    console.log('View entity details');
  }
}
