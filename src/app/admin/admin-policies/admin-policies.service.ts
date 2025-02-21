import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Inject, Injectable } from '@angular/core';

import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminPoliciesService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {}

  getDetailCommunity(id): Observable<any> {
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/core/communities/${id}?embed=logo&embed=subcommunities&embed=collections&embed=parentCommunity`
    );
  }
  getDetailCollection(id): Observable<any> {
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/core/collections/${id}?embed=parentCommunity%2FparentCommunity&embed=logo`
    );
  }
  getDetailBitsteam(id): Observable<any> {
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/core/bitstreams/${id}`
    );
  }
  getDetailItem(id): Observable<any> {
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/core/items/${id}?embed=thumbnail`
    );
  }
}
