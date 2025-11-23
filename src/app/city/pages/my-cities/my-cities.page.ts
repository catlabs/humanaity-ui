import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CityService } from '../../city.service';
import { CityOutput } from '../../../api/model/models';
import { CityCardComponent } from '../../components/card/city-card.component';

@Component({
  selector: 'app-my-cities',
  standalone: true,
  imports: [
    CommonModule,
    CityCardComponent,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './my-cities.page.html',
  styleUrl: './my-cities.page.scss'
})
export class MyCitiesPage implements OnInit {
  private cityService = inject(CityService);

  cities = signal<CityOutput[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  ngOnInit() {
    this.loadMyCities();
  }

  loadMyCities(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.cityService.getMyCities().subscribe({
      next: (cities) => {
        this.cities.set(Array.isArray(cities) ? cities : []);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || error.message || 'Failed to load your cities. Please try again.');
      }
    });
  }
}

