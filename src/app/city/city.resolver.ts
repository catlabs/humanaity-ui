import {ResolveFn} from '@angular/router';
import {CityService} from './city.service';
import {inject} from '@angular/core';
import {City} from '../core/graphql/models';

export const cityListResolver: ResolveFn<City[]> = (route, state) => {
  const service = inject(CityService);
  return service.getCities();
};
