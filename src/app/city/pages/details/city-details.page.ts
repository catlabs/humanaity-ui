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
import * as PIXI from 'pixi.js';
import {isPlatformBrowser} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {City, Human} from '../../../core/graphql/models';
import {CityService} from '../../city.service';
import {Subscription} from 'rxjs';
import {MatSidenavModule} from '@angular/material/sidenav';

interface HumanSprite {
  human: Human,
  sprite: PIXI.Text,
  hasCollision?: boolean,
  targetX?: number,
  targetY?: number
}


@Component({
  selector: 'app-city-details',
  templateUrl: './city-details.page.html',
  imports: [MatSidenavModule],
  styleUrl: './city-details.page.scss'
})
export class CityDetailsPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('container', {static: true}) containerRef!: ElementRef<HTMLDivElement>;
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute)
  public city: City = this.route.snapshot.data['city'];
  private service: CityService = inject(CityService);
  private app!: PIXI.Application;
  private humanWithStripes = signal<HumanSprite[]>([]);
  private isFirstSubscription = true;
  private subscription?: Subscription;

  ngOnInit() {
    this.subscription = this.service.subscribePositions(this.city.id).subscribe({
      next: humans => {
        humans.forEach(human => {
          if (!this.humanWithStripes().find(h => h.human.id === human.id)) {
            this.createHuman(human);
          } else {
            this.animateHuman(human);
          }
        })

      },
      error: (error) => console.error('Subscription error:', error)
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
      // Pour PixiJS v7+ - méthode simplifiée
      this.app.destroy();

      // Nettoyage supplémentaire pour éviter les memory leaks
      this.humanWithStripes().forEach(human => {
        human.sprite.destroy();
      });
      this.humanWithStripes.set([]);
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
      // Initialize PIXI Application
      this.app = new PIXI.Application();

      // Wait for the app to be ready
      await this.app.init({
        width: this.containerRef.nativeElement.clientWidth,
        height: this.containerRef.nativeElement.clientHeight,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
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

    } catch (error) {
      console.error('Failed to initialize PIXI application:', error);
    }
  }

  private createHuman(human: Human): void {
    // Choose face emoticon based on dominant personality trait
    const emoticon = this.getPersonalityFace(human);

    // Create text sprite for the emoticon
    const style = new PIXI.TextStyle({
      fontSize: 18,
      // fill: this.getPersonalityColor(human),
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif' // Ensure emoji support
    });

    const text = new PIXI.Text(emoticon, style);
    text.anchor.set(0.5); // Center the emoticon
    text.x = human.x * this.app.screen.width;
    text.y = human.y * this.app.screen.height;

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

  private getPersonalityFace(human: Human): string {
    const traits = [
      {name: 'CREATIVE', value: human.creativity, face: '🤔'},      // Thinking/creative face
      {name: 'INTELLECTUAL', value: human.intellect, face: '🧐'},   // Monocle face - analytical
      {name: 'SOCIABLE', value: human.sociability, face: '😊'},     // Happy/smiling face
      {name: 'PRACTICAL', value: human.practicality, face: '😐'}    // Neutral/practical face
    ];

    // Find dominant trait
    const dominant = traits.reduce((prev, current) =>
      (prev.value > current.value) ? prev : current
    );

    return dominant.face;
  }

  private animateHuman(human: Human): void {
    const existingHuman = this.humanWithStripes().find(h => h.human.id === human.id);
    if (existingHuman) {
      existingHuman.targetX = human.x * this.app.screen.width;
      existingHuman.targetY = human.y * this.app.screen.height;
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
}
