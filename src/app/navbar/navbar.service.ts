import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Injectable, Inject } from '@angular/core';


import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {}

  
  getCommunities(): Observable<any>{
    return this.http.get(
        `${this.appConfig.rest.baseUrl}/api/discover/search/objects?size=9999&dsoType=COMMUNITY`);
  }
  getCollections(): Observable<any>{
    return this.http.get(
        `${this.appConfig.rest.baseUrl}/api/discover/search/objects?size=9999&dsoType=COLLECTION`);
  }
}
