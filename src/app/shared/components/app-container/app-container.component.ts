import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [CommonModule],
  host: {
    class: 'block',
  },
  template: `
    <div class="max-w-screen-2xl mx-auto w-full px-4 md:px-6 lg:px-8">
      <ng-content />
    </div>
  `,
})
export class AppContainerComponent {}
