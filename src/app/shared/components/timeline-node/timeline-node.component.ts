import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-timeline-node',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './timeline-node.component.html',
  styleUrl: './timeline-node.component.scss'
})
export class TimelineNodeComponent {
  @Input() title!: string;
  @Input() period!: string;
  @Input() reasoning!: string;
}


