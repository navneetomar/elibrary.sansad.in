import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthorProfileService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {}
  getAuthorProfile(page: number): Observable<any> {
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/discover/search/objects?sort=score,DESC&page=${page}&size=5&configuration=person`
    );
  }
}
