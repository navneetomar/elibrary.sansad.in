import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Injectable, Inject } from '@angular/core';

import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
@Injectable({
  providedIn: 'root',
})
export class TreeDropDragService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {}

  getAllDataNote(id): Observable<any> {
    const subCom = this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/core/communities/${id}/subcommunities`
    );
    const coll = this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/core/communities/${id}/collections`
    );

    return forkJoin([subCom, coll]);
  }

  getAllItemCollection(id, page): Observable<any> {
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/discover/search/objects?sort=dc.date.accessioned,DESC&page=${page}&size=5&scope=${id}&dsoType=ITEM&embed=thumbnail`
    );
  }
  getAllBundlesItems(id): Observable<any> {
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/core/items/${id}/bundles?page=0&size=9999`
    );
  }
  getBitstreamItembyBundle(id): Observable<any> {
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/core/bundles/${id}/bitstreams`
    );
  }
  async getAllItemCollectionAsync(id, page) {
    let data = await this.http
      .get<any>(
        `${this.appConfig.rest.baseUrl}/api/discover/search/objects?sort=dc.date.accessioned,DESC&page=${page}&size=10&scope=${id}&dsoType=ITEM&embed=thumbnail`
      )
      .toPromise();
    return data;
  }
  async getAllDataNoteAsync(id) {
    let data = null;
    await Promise.all([this.getColl(id), this.getSubComm(id)])
      .then((res) => {
        data = res;
      })
      .catch((err) => err);
    return data;
  }
  getSubComm(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.http
        .get<any>(
          `${this.appConfig.rest.baseUrl}/api/core/communities/${id}/subcommunities`
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => reject()
        );
    });
  }
  getColl(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.http
        .get<any>(
          `${this.appConfig.rest.baseUrl}/api/core/communities/${id}/collections`
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => reject()
        );
    });
  }
}
