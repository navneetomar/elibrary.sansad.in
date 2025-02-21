import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';

import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { Bitstream } from 'src/app/core/shared/bitstream.model';
import { Item } from 'src/app/core/shared/item.model';

/**
 * This component renders the file section of the item
 * inside a 'ds-metadata-field-wrapper' component.
 */
@Component({
  selector: 'ds-item-page-file-statistics',
  templateUrl: './file-statistics.component.html',
  styleUrls: ['./file-statistics.component.scss'],
})
export class FileStatisticsComponent implements OnInit, OnDestroy {
  @Input() bitstream: Bitstream;

  @Input() item: Item;
  public results$: Observable<any>;
  public subcribe: Subscription;
  public views = 0;
  public downloads = 0;
  constructor(
    protected bitstreamDataService: BitstreamDataService,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService
  ) {}
  ngOnDestroy(): void {
    this.subcribe.unsubscribe();
  }

  ngOnInit(): void {
    this.results$ = this.bitstreamDataService
      .getAllStatisticsBitsteam(this.bitstream.id)
      .pipe(map((data) => data));
    this.subcribe = this.results$.subscribe((data) => {
   
      if (data && data.length > 0) {
        data.forEach((item) => {
          if (item.points && item.points.length > 0) {
            if (item['report-type'] === 'TotalDownloads') {
              this.downloads = item.points[0].values.views;
            } else {
              this.views = item.points[0].values.view_online;
            }
          }
        });
      }
      return data;
    });
  }
}
