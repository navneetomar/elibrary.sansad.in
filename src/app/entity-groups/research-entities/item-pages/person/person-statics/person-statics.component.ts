import {
  TOP_COUNTRIES,
  TOTAL_VISITSPERMONTH,
  TOTAL_VIEWONLINE_AND_DOWNLOAD_PER_MONTH,
} from './../../../../../core/config/constants';
import { PersonStaticsService } from './person-statics.service';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PanZoomConfig } from 'ngx-panzoom';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';
import { map } from 'rxjs/operators';

/**
 * This component renders any content inside this wrapper.
 * The wrapper prints a label before the content (if available)
 */

@Component({
  selector: 'ds-person-statics',
  styleUrls: ['./person-statics.component.scss'],
  templateUrl: './person-statics.component.html',
})
export class PersonStaticsComponent implements OnInit, OnDestroy {
  @Input() object: any;
  panZoomConfig: PanZoomConfig = new PanZoomConfig();
  public results$: Observable<any>;
  public dataResult: any;
  public chartTopCountry: any;
  public chartOptions: any;
  closeResult = '';
  subcribe: Subscription;

  fitContainer = false;

  view = [180, 100]; //width-height
  viewPie = [160, 160];
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
  public view_total = [
    // {
    //   name: 'China',
    //   value: 2243772,
    // },
  ];
  public viewonline_total = [];
  public top_countries = [];
  public entityTypes = [];
  gradient = false;
  timeline = true;
  doughnut = false;
  colorScheme3 = {
    domain: ['#E87531', '#11519B', '#9C8409', '#E8C402', '#9C4A19'],
  };
  total_view = 0;
  total_download = 0;
  //pie
  geoChart: GoogleChartInterface = {
    chartType: GoogleChartType.GeoChart,
    dataTable: [['Country', 'Views']],
    options: {
      title: 'Tasks',
      colorAxis: { colors: ['#91D5FF', '#1890FF'] },
      legend: 'none',
      // tooltip: { trigger: 'none' },
    },
  };
  constructor(
    private personStaticsService: PersonStaticsService,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.results$ = this.personStaticsService
      .getAllStaticsPerson(this.object.id)
      .pipe(map((result) => result));
    this.subcribe = this.results$.subscribe((data) => {
      if (data[0]) {
        if (data[0][TOP_COUNTRIES]) {
          // eslint-disable-next-line guard-for-in
          for (const property in data[0][TOP_COUNTRIES]) {
            let result = [];
            result.push(property);
            result.push(data[0][TOP_COUNTRIES][property]);
            this.geoChart.dataTable.push(result);
          }
        }
        if (data[0][TOTAL_VISITSPERMONTH]) {
          // eslint-disable-next-line guard-for-in
          for (const property in data[0][TOTAL_VISITSPERMONTH]) {
            this.total_view += data[0][TOTAL_VISITSPERMONTH][property];
            this.view_total.push({
              name: property,
              value: data[0][TOTAL_VISITSPERMONTH][property],
            });
          }
        }
        if (data[0][TOTAL_VIEWONLINE_AND_DOWNLOAD_PER_MONTH]) {
          // eslint-disable-next-line guard-for-in
          for (const property in data[0][
            TOTAL_VIEWONLINE_AND_DOWNLOAD_PER_MONTH
          ]) {
            this.total_download +=
              data[0][TOTAL_VIEWONLINE_AND_DOWNLOAD_PER_MONTH][property];
            this.viewonline_total.push({
              name: property,
              value: data[0][TOTAL_VIEWONLINE_AND_DOWNLOAD_PER_MONTH][property],
            });
          }
        }
      }
      if (data[1]) {
        if (data[1]._embedded.values.length > 0) {
          data[1]._embedded.values.forEach((item) => {
            this.entityTypes.push({
              name: item.label,
              value: item.count,
            });
          });
        }
      }
      return data;
    });
  }
  onSelect(e) {
    console.log(e);
  }
  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    return reason;
  }
  ngOnDestroy() {
    console.log('');
  }
}
