import {Routes} from '@angular/router';
import {CityListPage} from './pages/list/city-list.page';
import {CityDetailsPage} from './pages/details/city-details.page';
import {CreateCityPage} from './pages/create/create-city.page';
import {MyCitiesPage} from './pages/my-cities/my-cities.page';
import {cityDetailsResolver, cityListResolver, myCitiesResolver} from './city.resolver';

export const cityRoutes: Routes = [
  {path: '', component: CityListPage, resolve: {cities: cityListResolver}},
  {path: 'create', component: CreateCityPage},
  {path: 'mine', component: MyCitiesPage, resolve: {cities: myCitiesResolver}},
  {path: ':id', component: CityDetailsPage, resolve: {city: cityDetailsResolver}}
];
