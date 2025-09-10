import {Routes} from '@angular/router';
import {CityListPage} from './pages/list/city-list.page';
import {CityDetailsPage} from './pages/details/city-details.page';
import {cityListResolver} from './city.resolver';

export const cityRoutes: Routes = [
  {path: '', component: CityListPage, resolve: {cities: cityListResolver}},
  {path: ':id', component: CityDetailsPage}
];
