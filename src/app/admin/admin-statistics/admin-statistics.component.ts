import { ValidateEmailErrorStateMatcher } from './../../app.module';
import {
  ENUM_BITSTREAM,
  ENUM_ITEM,
  ENUM_COLLECTION,
  ENUM_COMMUNITY,
  ENUM_BITSTREAM_LABEL_EN,
  ENUM_BITSTREAM_LABEL_VN,
  ENUM_ITEM_LABEL_VN,
  ENUM_COLLECTION_LABEL_VN,
  ENUM_COMMUNITY_LABEL_VN,
  ENUM_ITEM_LABEL_EN,
  ENUM_COLLECTION_LABEL_EN,
  ENUM_COMMUNITY_LABEL_EN,
} from './../../core/config/constants';
import { AdminStatisticsService } from './admin-statistics.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import {
  Component,
  OnDestroy,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';

import { map, Observable, Subscription } from 'rxjs';
import { CustomNgbDateParserFormatter } from './custom-datatime-picker.component';
import { log } from 'console';
import { LocaleService } from 'src/app/core/locale/locale.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Component responsible for rendering the system wide Curation Task UI
 */
@Component({
  selector: 'ds-admin-statistics',
  templateUrl: './admin-statistics.component.html',
  styleUrls: ['./admin-statistics.component.scss'],
})
export class AdminStatisticsComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('elementRef', { static: false }) elementRef;
  @ViewChild('dpToDate', { static: false }) dpToDate: ElementRef;
  @ViewChild('dpFromDate', { static: false }) dpFromDate: ElementRef;

  hoveredDate: NgbDate | null = null;
  defaultStartDate = '1/3/2023';
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  name = 'Angular';

  width = 700;
  height = 300;
  fitContainer = false;

  view: any[] = [450, 300];
  view_column: any[] = [1000, 500];
  // options for the chart
  showXAxis = true;
  legendTitle = 'Chú thích';
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;

  timeline = true;
  doughnut = false; // full miền
  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90'],
  };
  chartOptions: any = {
    view: this.view,
    legend: true,
    legendPosition: 'below',
    showXAxis: true,
    showYAxis: true,
    showXAxisLabel: true,
    showYAxisLabel: true,
    xAxisLabel: 'Population',
    yAxisLabel: 'Country',
    showGridLines: true,
    roundDomains: true,
    xScaleMax: 100,
    barPadding: 0.3,
  };
  test = [
    {
      name: 'Germany',
      series: [
        {
          name: '2010',
          value: 40632,
          extra: {
            code: 'de',
          },
        },
      ],
    },
    {
      name: 'United States',
      series: [
        {
          name: '2010',
          value: 45986,
          extra: {
            code: 'us',
          },
        },
      ],
    },
    {
      name: 'France',
      series: [
        {
          name: '2010',
          value: 36745,
          extra: {
            code: 'fr',
          },
        },
      ],
    },
    {
      name: 'United Kingdom',
      series: [
        {
          name: '2010',
          value: 36240,
          extra: {
            code: 'uk',
          },
        },
      ],
    },
  ];
  public results_accesses_statType_and_objectType_list$: Observable<any>;
  public results_daily_access_list$: Observable<any>;
  public dayli_accesses_list = [
    {
      id: 1,
      name: '',
      series: [],
    },
    {
      id: 2,
      name: '',
      series: [],
    },
  ];
  subcribe: Subscription;
  //pie
  showLabels = true;
  // data goes here
  public accesses_objectType_list = [];
  public accesses_stattype_list = [];
  public list_series_search = [];
  public list_series_access = [];
  activePanelIds = ['toggle-1', 'toggle-2', 'toggle-3'];
  constructor(
    private calendar: NgbCalendar,
    public formatter: CustomNgbDateParserFormatter,
    private notificationsService: NotificationsService,
    public adminStatisticsService: AdminStatisticsService,
    public localeService: LocaleService,
    private translateService: TranslateService
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
 
  }

  ngOnInit(): void {
    let today = new Date();

    let endDate = `${today.getDate()}/${
      today.getMonth() + 1
    }/${today.getFullYear()}`;
    this.loadData(this.defaultStartDate, endDate);
  }
  isDisabled = (date: NgbDateStruct) => {
    const today = new Date();
    const selected = new Date(date.year, date.month - 1, date.day);
    return selected > today;
  };
  ngAfterViewInit() {
    this.view_column = [this.elementRef.nativeElement.offsetWidth * 0.95, 500];
    let today = new Date();

    let endDate = `${today.getDate()}/${
      today.getMonth() + 1
    }/${today.getFullYear()}`;
    // eslint-disable-next-line no-unused-expressions
    this.dpFromDate.nativeElement.value = this.defaultStartDate;
    this.dpToDate.nativeElement.value = endDate;
  }
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }
  handleObjectType(input) {
    if (input && input.name && input.value) {
      if (this.localeService.getCurrentLanguageCode() === 'en') {
        if (input.name === ENUM_BITSTREAM) {
          return { ...input, name: ENUM_BITSTREAM_LABEL_EN };
        } else if (input.name === ENUM_ITEM) {
          return { ...input, name: ENUM_ITEM_LABEL_EN };
        } else if (input.name === ENUM_COLLECTION) {
          return { ...input, name: ENUM_COLLECTION_LABEL_EN };
        } else if (input.name === ENUM_COMMUNITY) {
          return { ...input, name: ENUM_COMMUNITY_LABEL_EN };
        } else {
          return { ...input, value: 0 };
        }
      } else {
        if (input.name === ENUM_BITSTREAM) {
          return { ...input, name: ENUM_BITSTREAM_LABEL_VN };
        } else if (input.name === ENUM_ITEM) {
          return { ...input, name: ENUM_ITEM_LABEL_VN };
        } else if (input.name === ENUM_COLLECTION) {
          return { ...input, name: ENUM_COLLECTION_LABEL_VN };
        } else if (input.name === ENUM_COMMUNITY) {
          return { ...input, name: ENUM_COMMUNITY_LABEL_VN };
        } else {
          return { ...input, value: 0 };
        }
      }
    }
  }

  loadData(startDate, endDate) {
    this.results_accesses_statType_and_objectType_list$ =
      this.adminStatisticsService
        .getAllAccessesStatTypeAndObjectType(startDate, endDate)
        .pipe(map((result) => result));
    this.subcribe =
      this.results_accesses_statType_and_objectType_list$.subscribe((data) => {
        if (data && data[0].length > 0) {
          data[0].forEach((item) => {
            if (item && item.value > 0) {
              if (item.name === 'view') {
                this.accesses_stattype_list.push({
                  name: 'download',
                  value: item.value,
                });
              } else {
                this.accesses_stattype_list.push(item);
              }
            }
          });
        }
        if (data && data[1].length > 0) {
          data[1].forEach((item) => {
            if (
              item &&
              item.value > 0 &&
              this.handleObjectType(item).value > 0
            ) {
              if (this.handleObjectType(item)) {
                this.accesses_objectType_list.push(this.handleObjectType(item));
              }
            }
          });
        }
        return data;
      });
    this.results_daily_access_list$ = this.adminStatisticsService
      .getDailyAccesses(startDate, endDate)
      .pipe(map((result) => result));
    this.subcribe = this.results_daily_access_list$.subscribe((data) => {
      this.dayli_accesses_list.forEach((item) => {
        if (item.id === 1) {
          item.name =
            this.localeService.getCurrentLanguageCode() === 'en'
              ? 'Views'
              : 'Lượt truy cập';
          data.forEach((element) => {
            item.series.push({
              name: this.handleDateTime(element.name),
              value: element.valuev,
            });
            this.list_series_access.push({
              name: this.handleDateTime(element.name),
              value: element.valuev,
            });
          });
        }
        if (item.id === 2) {
          item.name =
            this.localeService.getCurrentLanguageCode() === 'en'
              ? 'Search'
              : 'Tìm kiếm';
          data.forEach((element) => {
            item.series.push({
              name: this.handleDateTime(element.name),
              value: element.valuew,
            });
            this.list_series_search.push({
              name: this.handleDateTime(element.name),
              value: element.valuew,
            });
          });
        }
      });
      return data;
    });
  }
  onSubmit(formValues) {
    if (
      !this.dpFromDate.nativeElement.value ||
      !this.dpToDate.nativeElement.value
    ) {
      this.notificationsService.error(
        this.translateService.get('admin.statistics.errors.datatime')
      );
    } else {
      if (
        this.checkFormatInput(this.dpFromDate.nativeElement.value) &&
        this.checkFormatInput(this.dpToDate.nativeElement.value)
      ) {
        this.accesses_stattype_list = [];
        this.accesses_objectType_list = [];
        this.dayli_accesses_list = [
          {
            id: 1,
            name:
              this.localeService.getCurrentLanguageCode() === 'en'
                ? 'Views'
                : 'Lượt truy cập',
            series: [],
          },
          {
            id: 2,
            name:
              this.localeService.getCurrentLanguageCode() === 'en'
                ? 'Search'
                : 'Tìm kiếm',
            series: [],
          },
        ];
        this.list_series_access = [];
        this.list_series_search = [];
        this.loadData(
          this.dpFromDate.nativeElement.value,
          this.dpToDate.nativeElement.value
        );
      } else {
        this.notificationsService.error(
          this.translateService.get('admin.statistics.errors.datatime.format')
        );
      }
    }
  }
  checkFormatInput(data: string) {
    const regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (regex.test(data)) {
      return true;
    } else {
      return false;
    }
  }
  handleDateTime(data: string) {
    const date = new Date(data);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Lưu ý rằng tháng bắt đầu từ 0
    const year = date.getFullYear();
    const formattedDate = `${day.toString().padStart(2, '0')}/${month
      .toString()
      .padStart(2, '0')}/${year.toString()}`;
    return formattedDate;
  }
  ngOnDestroy(): void {
    this.subcribe.unsubscribe();
    this.fromDate = null;
    this.toDate = null;
  }
}
