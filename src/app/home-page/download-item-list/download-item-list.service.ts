import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Injectable, Inject } from '@angular/core';

import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
@Injectable({
  providedIn: 'root',
})
export class DownloadItemListService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {}

  getListTopItemDownload(): Observable<any> {
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/statistics/usagereports/search/object?page=-1&size=16&uri=${this.appConfig.rest.baseUrl}//api/core/sites/ff3e5af8-1788-4e94-a3ba-f4b6a27e266d`
    );
  }
}
