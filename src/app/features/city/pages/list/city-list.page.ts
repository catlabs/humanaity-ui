import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CityOutput } from '../../../../api/model/models';
import { SimulationCardComponent, SimulationCardData, SimulationStatus } from '../../../../shared/components/simulation-card/simulation-card.component';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { CityService } from '../../city.service';

type FilterTab = 'all' | 'running' | 'completed' | 'draft';

@Component({
  selector: 'app-city-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatPaginatorModule,
    SimulationCardComponent,
    AppHeaderComponent
  ],
  templateUrl: './city-list.page.html',
  styleUrl: './city-list.page.scss'
})
export class CityListPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cityService = inject(CityService);

  cities = signal<CityOutput[]>([]);
  filteredCities = signal<SimulationCardData[]>([]);
  activeFilter: FilterTab = 'all';
  pageSize = 9;
  currentPage = 0;

  ngOnInit() {
    // Load cities from route data or service
    const routeData = this.route.snapshot.data['cities'];
    if (routeData) {
      this.cities.set(routeData);
    } else {
      this.loadCities();
    }
    this.applyFilter();
  }

  loadCities(): void {
    this.cityService.getCities().subscribe({
      next: (cities) => {
        this.cities.set(cities);
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error loading cities:', error);
      }
    });
  }

  onFilterChange(filter: FilterTab): void {
    this.activeFilter = filter;
    this.currentPage = 0;
    this.applyFilter();
  }

  applyFilter(): void {
    let filtered = this.cities().map(city => this.convertToSimulationCard(city));
    
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(card => {
        if (this.activeFilter === 'running') return card.status === 'running';
        if (this.activeFilter === 'completed') return card.status === 'completed';
        if (this.activeFilter === 'draft') return card.status === 'draft';
        return true;
      });
    }

    this.filteredCities.set(filtered);
  }

  convertToSimulationCard(city: CityOutput): SimulationCardData {
    // Map city to simulation card data
    // For now, we'll use default values - you can enhance this based on actual city data
    const status: SimulationStatus = 'draft'; // TODO: Get actual status from city or simulation service
    
    return {
      id: city.id!,
      name: city.name || 'Unnamed Simulation',
      description: 'Human civilization simulation with AI-generated inhabitants and real-time interactions.',
      status: status,
      icon: 'location_city',
      iconColor: '#3b82f6',
      createdAt: 'Recently',
      lastRun: 'Never'
    };
  }

  onCardClick(cityId: number): void {
    this.router.navigate(['/cities', cityId]);
  }

  onCreateNew(): void {
    this.router.navigate(['/cities/create']);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getPaginatedCities(): SimulationCardData[] {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredCities().slice(start, end);
  }
}
