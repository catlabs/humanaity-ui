import {inject, Injectable} from '@angular/core';
import {Observable, interval, from, of} from 'rxjs';
import {switchMap, startWith, map} from 'rxjs/operators';
import {CitiesService} from '../api/api/cities.service';
import {HumansService} from '../api/api/humans.service';
import {CityOutput, HumanOutput} from '../api/model/models';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private citiesService = inject(CitiesService);
  private humansService = inject(HumansService);

  /**
   * Converts a Blob response to JSON object
   * This is needed because OpenAPI generator with fetch API returns Blobs instead of parsed JSON
   */
  private blobToJson<T>(response: any): Observable<T> {
    if (response instanceof Blob) {
      return from(new Promise<T>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            const text = reader.result as string;
            resolve(JSON.parse(text));
          } catch (e) {
            reject(new Error('Failed to parse JSON response: ' + e));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read Blob'));
        reader.readAsText(response);
      }));
    }
    return of(response);
  }

  getCities(): Observable<CityOutput[]> {
    return this.citiesService.getAllCities().pipe(
      switchMap(response => this.blobToJson<CityOutput[]>(response))
    );
  }

  getCity(id: string): Observable<CityOutput> {
    return this.citiesService.getCityById(id).pipe(
      switchMap(response => this.blobToJson<CityOutput>(response))
    );
  }

  // Note: Subscriptions are not available in REST, using polling instead
  subscribePositions(cityId: string): Observable<HumanOutput[]> {
    // Poll every 100ms to simulate real-time updates
    return interval(100).pipe(
      startWith(0),
      switchMap(() => this.humansService.getHumansByCity(cityId).pipe(
        switchMap(response => this.blobToJson<HumanOutput[]>(response))
      ))
    );
  }
}
