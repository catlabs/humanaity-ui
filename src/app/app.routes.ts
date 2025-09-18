import {Routes} from '@angular/router';
import {cityRoutes} from './city/city.route';

export const routes: Routes = [
  {path: 'cities', children: cityRoutes},
  {path: '', redirectTo: '/cities', pathMatch: 'full'},
  {path: '**', redirectTo: '/cities'}
];
