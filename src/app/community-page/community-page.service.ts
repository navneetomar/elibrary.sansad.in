import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Inject, Injectable } from '@angular/core';

import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';

@Injectable({
  providedIn: 'root',
})
export class CommunityPageService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {}

  statisticsPublicationsInCommunity(): Observable<any> {
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/statistics/amount?count=Item&parent=comm`
    );
  }
}
