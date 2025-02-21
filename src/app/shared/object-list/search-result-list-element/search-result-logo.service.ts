import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchResultLogoService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {}

  getLogoByType(id, type): Observable<any> {
    const logoItem = this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/core/${type}/${id}?embed=logo`
    );
    return logoItem;
  }
}
