import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Inject, Injectable } from '@angular/core';

import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
@Injectable({
  providedIn: 'root',
})
export class CollectionFilterService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {}

  getFacets(id: string): Observable<any> {
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/discover/facets?scope=${id}&configuration=default`
    );
  }
  getFacetByType(id: string,page: number,type: string): Observable<any> {
    return this.http.get<any>(
        `${this.appConfig.rest.baseUrl}/api/discover/facets/${type}?page=${page}&size=5&configuration=default&scope=${id}`
      );
  }
}