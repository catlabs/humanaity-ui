import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

export interface EntityData {
  name: string;
  type: string;
  icon: string;
  iconColor: string;
  status: string;
  level?: number;
  capacity?: { current: number; max: number };
  efficiency?: number;
  workers?: number;
  maintenanceCost?: string;
  builtAt?: string;
}

@Component({
  selector: 'app-entity-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  templateUrl: './entity-panel.component.html',
  styleUrl: './entity-panel.component.scss'
})
export class EntityPanelComponent {
  @Input() entity!: EntityData;
  @Output() viewDetails = new EventEmitter<void>();

  getCapacityPercentage(): number {
    if (!this.entity.capacity) return 0;
    return (this.entity.capacity.current / this.entity.capacity.max) * 100;
  }
}


