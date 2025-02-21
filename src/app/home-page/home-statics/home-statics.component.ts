import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';

import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';

@Component({
  selector: 'ds-home-statics',
  styleUrls: ['./home-statics.component.scss'],
  templateUrl: './home-statics.component.html',
})

/**
 * Component to render the news section on the home page
 */
export class HomeStaticsComponent implements OnInit {
  public results$: Observable<any>;
  public dataResult: any;
  constructor(
    public http: HttpClient,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {}
  ngOnInit(): void {
    // this.results$ = this.getStaticsHomePage().pipe(
    //   map((data) => (this.dataResult = data._embedded.values))
    // );
  }
  getStaticsHomePage(): Observable<any> {
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/discover/facets/itemtype?sort=score,DESC&page=0&size=4`
    );
  }
}
