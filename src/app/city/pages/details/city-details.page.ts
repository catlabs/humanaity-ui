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

interface HumanSprite {
  human: Human,
  sprite: PIXI.Sprite
}


@Component({
  selector: 'app-city-details',
  templateUrl: './city-details.page.html',
  styleUrl: './city-details.page.scss'
})
export class CityDetailsPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('container', {static: true}) containerRef!: ElementRef<HTMLDivElement>;
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute)
  private service: CityService = inject(CityService);
  private app!: PIXI.Application;
  private city: City = this.route.snapshot.data['city'];
  private humans = signal<HumanSprite[]>([]);
  private isFirstSubscription = true;
  private subscription?: Subscription;

  ngOnInit() {
    this.subscription = this.service.subscribePositions(this.city.id).subscribe({
      next: humans => {
        console.log(humans);
        if (this.isFirstSubscription) {
          this.isFirstSubscription = false;
          this.createHumans(humans);
        } else {
          this.animateHumans(humans);
        }

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
      this.humans().forEach(human => {
        human.sprite.destroy();
      });
      this.humans.set([]);
    }
  }

  private async createPixiApp(): Promise<void> {
    try {
      // Initialize PIXI Application
      this.app = new PIXI.Application();

      // Wait for the app to be ready
      console.log(this.containerRef.nativeElement.clientWidth);
      console.log(this.containerRef.nativeElement.clientHeight);
      await this.app.init({
        width: this.containerRef.nativeElement.clientWidth,
        height: this.containerRef.nativeElement.clientHeight,
        backgroundColor: 0xeeeeee,
        resolution: window.devicePixelRatio || 1,
        antialias: true,
      });

      // Add the canvas to the DOM
      this.containerRef.nativeElement.appendChild(this.app.canvas as HTMLCanvasElement);
      // this.animate();
      this.handleResize();

    } catch (error) {
      console.error('Failed to initialize PIXI application:', error);
    }
  }

  private createHumans(humans: Human[]): void {
    humans.forEach(human => {
      const g = new PIXI.Graphics();
      g.circle(0, 0, 5).fill({color: Math.random() * 0xffffff, alpha: 0.8});
      const texture = this.app.renderer.generateTexture(g);
      const sprite = new PIXI.Sprite(texture);
      sprite.x = human.x * this.app.screen.width;
      sprite.y = human.y * this.app.screen.height;
      (sprite as any).vx = (Math.random() - 0.5) * 2;
      (sprite as any).vy = (Math.random() - 0.5) * 2;
      sprite.eventMode = 'static';
      sprite.cursor = 'pointer';
      sprite.on('pointerdown', () => {
        sprite.tint = Math.random() * 0xffffff;
      });
      this.app.stage.addChild(sprite);
      this.humans().push({human, sprite});
    })
  }

  private animateHumans(humans: Human[]): void {
    const newHumans: HumanSprite[] = [];
    humans.forEach(human => {
      const existingHuman = this.humans().find(h => h.human.id === human.id);
      if (existingHuman) {
        this.animateSpriteMovement(existingHuman.sprite, human.x * this.app.screen.width, human.y * this.app.screen.height);
        newHumans.push({human, sprite: existingHuman.sprite});
      }
    });
    this.humans.update(() => newHumans);
  }

  private animateSpriteMovement(sprite: PIXI.Sprite, targetX: number, targetY: number): void {
    // Simple linear interpolation for movement animation
    const speed = 0.1;
    const animate = () => {
      sprite.x += (targetX - sprite.x) * speed;
      sprite.y += (targetY - sprite.y) * speed;

      // Continue animation until close to target
      if (Math.abs(sprite.x - targetX) > 1 || Math.abs(sprite.y - targetY) > 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
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
