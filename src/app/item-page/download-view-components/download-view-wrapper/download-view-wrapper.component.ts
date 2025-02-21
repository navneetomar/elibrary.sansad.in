import { Observable, Subscription, map } from 'rxjs';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DownloadViewWrapperService } from './download-view-wrapper.service';
import { log } from 'console';
import { any } from 'prop-types';
import { hasValue } from 'src/app/shared/empty.util';

/**
 * This component renders any content inside this wrapper.
 * The wrapper prints a label before the content (if available)
 */
@Component({
  selector: 'ds-download-view-wrapper',
  styleUrls: ['./download-view-wrapper.component.scss'],
  templateUrl: './download-view-wrapper.component.html',
})
export class DownloadViewWrapperComponent implements OnInit, OnDestroy {
  @Input() object: any;
  public results$: Observable<any>;
  public dataResult: any;

  subcribe: Subscription;
  // static number item
  topViewOnline = 0;
  totalDownloads = 0;
  totalVisits = 0;
  // draw chart
  totalVisitsPerMonth = [];
  totalViewOnlinePerMonth = [];
  totalDownloadPerMonth = [];

  fitContainer = false;

  view = [122, 50]; //width-height
  // options for the chart
  showXAxis = true;
  showYAxis = true;

  showXAxisLabel = true;
  showYAxisLabel = true;

  colorScheme = {
    domain: ['#159277'],
  };
  colorScheme2 = {
    domain: ['#7D0141'],
  };
  //pie
  showLabels = true;
  // data goes here
  public single = [
    // {
    //   name: 'China',
    //   value: 2243772,
    // },
    // {
    //   name: 'USA',
    //   value: 1126000,
    // },
    // {
    //   name: 'Norway',
    //   value: 296215,
    // },
    // {
    //   name: 'Japan',
    //   value: 257363,
    // },
    // {
    //   name: 'Germany',
    //   value: 196750,
    // },
    // {
    //   name: 'France',
    //   value: 204617,
    // },
  ];
  public single2 = [];
  constructor(private downloadviewService: DownloadViewWrapperService) {}
  ngOnInit(): void {
    this.results$ = this.downloadviewService
      .getAllStaticsItem(this.object.id)
      .pipe(map((result) => result));
    this.subcribe = this.results$.subscribe((data) => {
      if (data) {
        // Top view Online
        if (data[0]?.points?.length > 0) {
          let total = 0;
          data[0].points.map((item) => {
            total += item.values.view_online;
          });
          this.topViewOnline = total;
        }
        // total downloads
        if (data[1]?.points?.length > 0) {
          let total1 = 0;
          data[1].points.map((item) => {
            total1 += item.values.views;
          });
          this.totalDownloads = total1;
        }
        // totalVisits
        if (data[2]?.points?.length > 0) {
          let total2 = 0;
          data[2].points.map((item) => {
            total2 += item.values.views;
          });
          this.totalVisits = total2;
        }
        //"TotalVisitsPerMonth"
        if (data[3]?.points?.length > 0) {
          data[3].points.map((item) => {
            this.totalVisitsPerMonth.push({
              name: item.id,
              value: item.values.views,
            });
          });
        }
        //"TotalViewOnlinePerMonth"
        if (data[4]?.points?.length > 0) {
          data[4].points.map((item) => {
            this.totalViewOnlinePerMonth.push({
              name: item.id,
              value: item.values.view_online,
            });
          });
        }
        //"TotalDownloadPerMonth"
        if (data[5]?.points?.length > 0) {
          data[5].points.map((item) => {
            this.totalDownloadPerMonth.push({
              name: item.id,
              value: item.values.view,
            });
          });
        }
      }
      this.single = this.totalVisitsPerMonth;
      this.single2 = this.buildObjectSeeDownload(
        this.totalViewOnlinePerMonth,
        this.totalDownloadPerMonth
      );

      return data;
    });
  }
  ngOnDestroy(): void {
    this.subcribe.unsubscribe();
  }
  sumCount(a: number, b: number) {
    if (typeof a !== 'number' && typeof b !== 'number') {
      return 0;
    } else if (
      typeof a !== 'number' &&
      typeof b === 'number' &&
      Math.floor(b) === b
    ) {
      return b;
    } else if (
      typeof a === 'number' &&
      typeof b !== 'number' &&
      Math.floor(a) === a
    ) {
      return a;
    } else {
      return a + b;
    }
  }
  onSelect(e) {
    console.log(e);
  }
  buildObjectSeeDownload(arr1, arr2) {
    let result = [];
    if (arr1.length > 0 && arr2.length > 0) {
      arr1.forEach((item1) => {
        arr2.forEach((item2) => {
          if (item1.name === item2.name) {
            result.push({
              name: item1.name,
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              value: item1.value + item2.value,
            });
          }
        });
      });
    }
    return result;
  }
}
