import {Routes} from '@angular/router';
import {CityListComponent} from './components/city-list/city-list.component';
import {CityDetailsComponent} from './components/city-details/city-details.component';
import {cityListResolver} from './city.resolver';

export const cityRoutes: Routes = [
  {path: '', component: CityListComponent, resolve: {cities: cityListResolver}},
  {path: ':id', component: CityDetailsComponent}
];
