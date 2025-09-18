import {inject, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {map, Observable} from 'rxjs';
import {
  City,
  GetCitiesDocument,
  GetCitiesQuery,
  GetCityDocument,
  GetCityQuery,
  Human,
  PositionSubDocument,
  PositionSubSubscription
} from '../core/graphql/models';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apollo = inject(Apollo);

  getCities(): Observable<City[]> {
    return this.apollo
      .watchQuery<GetCitiesQuery>({
        query: GetCitiesDocument,
      })
      .valueChanges.pipe(map(result => result.data.cities));
  }

  getCity(id: string): Observable<City> {
    return this.apollo.watchQuery<GetCityQuery>({
      query: GetCityDocument,
      variables: {id}
    })
      .valueChanges.pipe(map(result => result.data.city));
  }

  subscribePositions(cityId: string): Observable<Human[]> {
    return this.apollo.subscribe<PositionSubSubscription>({
      query: PositionSubDocument,
      variables: {cityId}
    }).pipe(map(resp => resp.data?.humansByCityPositions || []))

  }

  /* deleteCity(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation {
          deleteCity(id: ${id})
        }
      `,
    });
  } */
}
