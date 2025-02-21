import {
  STATISTICS_TYPE,
  BY_STAT_TYPE_PROGRESS_LINE,
  OVERALL_PIE,
  BY_STAT_TYPE_BAR,
} from './../../core/config/constants';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Inject, Injectable } from '@angular/core';

import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminStatisticsService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {}

  getAllAccessesStatTypeAndObjectType(start?, end?): Observable<any> {
    const accessesStatType = this.http.post<any>(
      `${this.appConfig.rest.baseUrl}/api/dladmin/statistics/querysolr?start=${start}&ff=${STATISTICS_TYPE}&type=${OVERALL_PIE}&end=${end}`,
      JSON.stringify({}),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const accessesObjectType = this.http.post<any>(
      `${this.appConfig.rest.baseUrl}/api/dladmin/statistics/querysolr?start=${start}&end=${end}&type=${OVERALL_PIE}`,
      JSON.stringify({}),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return forkJoin([accessesStatType, accessesObjectType]);
  }
  getDailyAccesses(start?, end?): Observable<any> {
    const infor = this.http.post<any>(
      `${this.appConfig.rest.baseUrl}/api/dladmin/statistics/querysolr?start=${start}&ff=${STATISTICS_TYPE}&type=${BY_STAT_TYPE_PROGRESS_LINE}&end=${end}`,
      JSON.stringify({}),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return infor;
  }
  getBarchartObjectType(start?, end?): Observable<any> {
    const infor = this.http.post<any>(
      `${this.appConfig.rest.baseUrl}/api/dladmin/statistics/querysolr?start=${start}&type=${BY_STAT_TYPE_BAR}&end=${end}`,
      JSON.stringify({}),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return infor;
  }

  getAllStatistics(): Observable<any> {
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/statistics/usagereports/search/object?page=-1&size=10&uri=${this.appConfig.rest.baseUrl}//api/core/sites/ff3e5af8-1788-4e94-a3ba-f4b6a27e266d`
    );
  }
}
