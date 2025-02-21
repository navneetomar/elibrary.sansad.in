import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Inject, Injectable } from '@angular/core';

import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
@Injectable({
  providedIn: 'root',
})
export class DownloadViewWrapperService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {}

  getAllStaticsItem(id): Observable<any> {
    const topViewOnline = this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/statistics/usagereports/${id}_TopViewOnline`
    );
    const totalDownloads = this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/statistics/usagereports/${id}_TotalDownloads`
    );
    const totalVisits = this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/statistics/usagereports/${id}_TotalVisits`
    );
    const totalVisitsPerMonth = this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/statistics/usagereports/${id}_TotalVisitsPerMonth`
    );
    const totalViewOnlinePerMonth = this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/statistics/usagereports/${id}_TotalViewOnlinePerMonth`
    );
    const totalDownloadPerMonth = this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/statistics/usagereports/${id}_TotalDownloadPerMonth`
    );

    return forkJoin([
      topViewOnline,
      totalDownloads,
      totalVisits,
      totalVisitsPerMonth,
      totalViewOnlinePerMonth,
      totalDownloadPerMonth,
    ]);
  }
}
