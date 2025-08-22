import {inject, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {map, Observable} from 'rxjs';
import {City, GetCitiesDocument, GetCitiesQuery} from '../core/graphql/models';

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
