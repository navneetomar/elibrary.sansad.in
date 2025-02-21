import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  Input,
} from '@angular/core';

import { map, Observable, Subscription } from 'rxjs';

import { LocaleService } from 'src/app/core/locale/locale.service';
import { TranslateService } from '@ngx-translate/core';
import { AdminStatisticsService } from '../admin-statistics.service';
import {
  TOTAL_COLL_VISITS,
  TOTAL_COMM_VISITS,
  TOTAL_ITEM_VISITS,
} from 'src/app/core/config/constants';

/**
 * Component responsible for rendering the system wide Curation Task UI
 */
@Component({
  selector: 'ds-admin-statistics-ranking',
  templateUrl: './admin-statistics-ranking.component.html',
  styleUrls: ['./admin-statistics-ranking.component.scss'],
})
export class AdminStatisticsRankingComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() widthChart: any;
  public results$: Observable<any>;
  subcribe: Subscription;

  view_columns: any[] = [];
  showXAxis = true;
  legendTitle = 'Chú thích';
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  activePanelIds = ['toggle-1'];
  timeline = true;
  doughnut = false; // full miền
  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90'],
  };

  itemsViewOnlineTop = [];
  collectionsViewOnlineTop = [];
  communitiesViewOnlineTop = [];
  constructor(
    public localeService: LocaleService,
    private translateService: TranslateService,

    public adminStatisticsService: AdminStatisticsService
  ) {}
  ngOnInit(): void {
    this.results$ = this.adminStatisticsService
      .getAllStatistics()
      .pipe(map((result) => result));
    this.results$.subscribe((result) => {
      if (
        result &&
        result._embedded &&
        result._embedded.usagereports.length > 0
      ) {
        result._embedded.usagereports.forEach((item) => {
          if (this.getTypeStatistics(item) === TOTAL_ITEM_VISITS) {
            this.itemsViewOnlineTop = this.buildDataChart(item);
          }
          if (this.getTypeStatistics(item) === TOTAL_COLL_VISITS) {
            this.collectionsViewOnlineTop = this.buildDataChart(item);
          }
          if (this.getTypeStatistics(item) === TOTAL_COMM_VISITS) {
            this.communitiesViewOnlineTop = this.buildDataChart(item);
          }
        });
      }
      return result;
    });
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit() {
    this.view_columns = [this.widthChart[0] * 0.9, 350];
  }
  getTypeStatistics(item) {
    if (item && item.id) {
      return `${item['report-type']}_${item.id.split('_')[1]}`;
    }
    return null;
  }
  buildDataChart(item) {
    let result = [];
    if (item && item.points && item.points.length > 0) {
      item.points.forEach((item) => {
        result.push({
          name: item.label,
          series: [
            {
              name: 'views',
              value: item.values.views,
            },
          ],
        });
      });
    }
    return result;
  }
  ngOnDestroy(): void {
    console.log('');
  }
}
