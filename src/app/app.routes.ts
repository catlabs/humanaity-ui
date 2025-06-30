import { Routes } from '@angular/router';
import {cityResolver} from './city/city-resolver';

export const routes: Routes = [
  { path: '', redirectTo: '/humanaity/1', pathMatch: 'full' },
  { path: 'humanaity/:cityId', loadComponent: () => import('./city/city').then(m => m.City), resolve: { city: cityResolver } },
];
