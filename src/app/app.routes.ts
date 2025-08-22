import {Routes} from '@angular/router';
import {cityRoutes} from './city/city.route';
import {cityListResolver} from './city/city.resolver';

export const routes: Routes = [
  {path: 'cities', children: cityRoutes, resolve: {city: cityListResolver}},
  {path: '', redirectTo: '/cities', pathMatch: 'full'},
  {path: '**', redirectTo: '/cities'}
];
