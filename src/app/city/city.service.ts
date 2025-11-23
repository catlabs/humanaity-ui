import {inject, Injectable, Inject, Optional} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, interval, from, of} from 'rxjs';
import {switchMap, startWith, map} from 'rxjs/operators';
import {CitiesService} from '../api/api/cities.service';
import {HumansService} from '../api/api/humans.service';
import {CityOutput, HumanOutput} from '../api/model/models';
import {BASE_PATH} from '../api/variables';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private citiesService = inject(CitiesService);
  private humansService = inject(HumansService);
  private httpClient = inject(HttpClient);
  @Optional() @Inject(BASE_PATH) private basePath?: string;

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

  createCity(cityInput: { name: string }): Observable<CityOutput> {
    return this.citiesService.createCity(cityInput).pipe(
      switchMap(response => this.blobToJson<CityOutput>(response))
    );
  }

  getMyCities(): Observable<CityOutput[]> {
    // Use HttpClient directly since the generated service might not have this endpoint yet
    // We'll call /api/cities/mine directly using the same basePath as other services
    const basePath = this.basePath || 'http://localhost:8080';
    const url = `${basePath}/api/cities/mine`;
    // HttpClient.get returns parsed JSON by default, so we can use it directly
    // But we still need to handle potential Blob responses (though unlikely with default HttpClient)
    return this.httpClient.get(url).pipe(
      switchMap((response: any) => {
        // If response is already an array, return it directly
        if (Array.isArray(response)) {
          return of(response as CityOutput[]);
        }
        // Otherwise, try to convert from Blob
        return this.blobToJson<CityOutput[]>(response);
      })
    );
  }
}
