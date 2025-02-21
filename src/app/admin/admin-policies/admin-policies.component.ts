import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

@Component({
  selector: 'ds-admin-policy',
  templateUrl: './admin-policies.component.html',
  styleUrls: ['./admin-policies.component.scss'],
})
export class AdminPoliciesComponent implements OnInit, OnDestroy {
  public loading = false;
  public results$: Observable<any>;
  public dataResult: any;
  subcribe: Subscription;
  node: any;
  querySearch = '';
  querySearchOutput = '';
  isChangeTabOut = false;

  constructor(
    public http: HttpClient,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.loadData();
    console.log('server config', this.appConfig);
  }
  getCommunities(): Observable<any> {
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/core/communities/search/top?page=0&size=30&sort=dc.title,ASC&embed.size=subcommunities=1&embed=subcommunities&embed.size=collections=1&embed=collections`
    );
  }
  addNewItem(node) {
    this.node = node;
  }
  searchNode(e) {
    this.querySearchOutput = e.target.value;
  }
  resetSearch() {
    this.querySearchOutput = '';
    this.querySearch = '';
    this.loadData();
  }
  loadData() {
    this.results$ = this.getCommunities().pipe(map((data) => data));
    this.results$.subscribe((data) => {
      this.dataResult = data._embedded.communities;
    });
  }
  handleProcessedData(event) {
    if (event) {
      this.loadData();
    }
  }
  onReloadData(event) {
    if (event) {
      this.isChangeTabOut = event;
    }
  }
  ngOnDestroy(): void {
    console.log('');
  }
}
