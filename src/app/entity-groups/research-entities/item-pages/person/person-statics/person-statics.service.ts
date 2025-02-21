import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Injectable, Inject } from '@angular/core';

import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
@Injectable({
  providedIn: 'root',
})
export class PersonStaticsService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {}

  getAllStaticsPerson(id): Observable<any> {
    const allStaticsPerson = this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/statistics/usagereports/author?page=-1&size=10&uri=/${id}`
    );
    const allEntityPerson = this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/discover/facets/entityType?page=0&size=50&configuration=default-relationships&f.isAuthorOfPublication=${id},equals`
    );
    return forkJoin([allStaticsPerson, allEntityPerson]);
  }
}
