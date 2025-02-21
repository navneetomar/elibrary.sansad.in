import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';

@Injectable({
  providedIn: 'root',
})
export class CommunityLogoService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {}

  getLogoComm(obj: any): Observable<any> {
    const getDetailComm = this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/core/communities/${obj.id}?embed=logo`
    );

    return getDetailComm;
  }
}
