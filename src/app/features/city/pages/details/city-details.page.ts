import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CityOutput, HumanOutput, SimulationsService} from '@api';
import {CityService} from '../../city.service';
import {PixiCanvasService} from '../../services/pixi-canvas.service';
import {Subscription} from 'rxjs';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {AppContainerComponent, EventItemComponent, EventType, EntityPanelComponent, EntityData} from '@shared';


@Component({
  selector: 'app-city-details',
  templateUrl: './city-details.page.html',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    AppContainerComponent,
    EventItemComponent,
    EntityPanelComponent
  ]
})
export class CityDetailsPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('container', {static: true}) containerRef!: ElementRef<HTMLDivElement>;
  private route = inject(ActivatedRoute);
  public city: CityOutput = this.route.snapshot.data['city'];
  private cityService = inject(CityService);
  private simulationService = inject(SimulationsService);
  private pixiCanvasService = inject(PixiCanvasService);
  private subscription?: Subscription;

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
    // No-op: defer Pixi init until view is ready
  }

  ngAfterViewInit(): void {
    this.pixiCanvasService.initialize(this.containerRef.nativeElement).then(() => {
    this.subscription = this.cityService.subscribePositions(String(this.city.id!)).subscribe({
      next: humans => {
        humans.forEach(human => {
          this.pixiCanvasService.addHuman(human);
          this.pixiCanvasService.updateHuman(human);
        });
      },
      error: (error) => {
        console.error('Error subscribing to positions:', error);
      }
    });
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.pixiCanvasService.destroy();
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
