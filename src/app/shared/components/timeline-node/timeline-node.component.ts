import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ReasoningDialogComponent, ReasoningDialogData } from './reasoning-dialog.component';

@Component({
  selector: 'app-timeline-node',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './timeline-node.component.html',
  styleUrl: './timeline-node.component.scss'
})
export class TimelineNodeComponent {
  private dialog = inject(MatDialog);

  @Input() title!: string;
  @Input() period!: string;
  @Input() reasoning!: string;

  openReasoningDialog(): void {
    const data: ReasoningDialogData = {
      title: this.title,
      period: this.period,
      reasoning: this.reasoning
    };

    this.dialog.open(ReasoningDialogComponent, {
      data,
      width: '500px',
      maxWidth: '90vw'
    });
  }
}


