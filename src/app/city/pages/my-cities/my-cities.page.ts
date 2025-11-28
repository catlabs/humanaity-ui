import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CityOutput } from '../../../api/model/models';
import { CityCardComponent } from '../../components/card/city-card.component';
import { CreateSimulationDialogComponent } from '../../../shared/components/create-simulation-dialog/create-simulation-dialog.component';
import { CityService } from '../../city.service';

@Component({
  selector: 'app-my-cities',
  standalone: true,
  imports: [
    CommonModule,
    CityCardComponent,
    MatButtonModule,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './my-cities.page.html',
  styleUrl: './my-cities.page.scss'
})
export class MyCitiesPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private cityService = inject(CityService);

  cities = signal<CityOutput[]>(this.route.snapshot.data['cities'] || []);

  onCreateNew(): void {
    const dialogRef = this.dialog.open(CreateSimulationDialogComponent, {
      width: '500px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((result: CityOutput | undefined) => {
      if (result && result.id) {
        // Reload cities list and navigate to the newly created city
        this.loadCities();
        this.router.navigate(['/cities', result.id]);
      }
    });
  }

  private loadCities(): void {
    this.cityService.getCities().subscribe({
      next: (cities) => {
        this.cities.set(cities);
      },
      error: (error) => {
        console.error('Error loading cities:', error);
      }
    });
  }
}

