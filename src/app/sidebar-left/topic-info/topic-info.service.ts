import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';

@Injectable({
  providedIn: 'root',
})
export class TopicInfoService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {}
  getTopics(page: number): Observable<any> {
    const topics = this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/core/topics/search/top?page=${page}&size=5`
    );
    const entriesTopic = this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/discover/browses/topic/entries?sort=default,ASC&page=${page}&size=1000`
    );
    return forkJoin([topics, entriesTopic]);
  }
}
