import { Observable, Subscription, map } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DownloadItemListService } from './download-item-list.service';
import {
  NgbCarousel,
  NgbCarouselModule,
  NgbSlideEvent,
  NgbSlideEventSource,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-download-item-list',
  templateUrl: './download-item-list.component.html',
  styleUrls: ['./download-item-list.component.scss'],
})
export class DownloadItemListComponent implements OnInit, OnDestroy {
  @ViewChild('carousel', { static: true }) carousel: NgbCarousel;
  public results$: Observable<any>;
  public listItemTopDownloadCarousel: any;
  public listItemTopDownload: any;
  subcribe: Subscription;
  itemsGroup = [];
  carouselCounter = 3;
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;
  constructor(private topDownloadItemService: DownloadItemListService) {}
  ngOnInit(): void {
    // this.results$ = this.topDownloadItemService.getListTopItemDownload().pipe(
    //   map((data) => {
    //     this.listItemTopDownloadCarousel = this.transform(
    //       data._embedded.usagereports[1].points,
    //       this.carouselCounter
    //     );
    //     this.listItemTopDownload = data._embedded.usagereports[1].points;
    //   })
    // );
    // this.subcribe = this.results$.subscribe((data) => data);
  }
  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (
      this.unpauseOnArrow &&
      slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT ||
        slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)
    ) {
      this.togglePaused();
    }
    if (
      this.pauseOnIndicator &&
      !slideEvent.paused &&
      slideEvent.source === NgbSlideEventSource.INDICATOR
    ) {
      this.togglePaused();
    }
  }
  roundDownToNearestMultipleOfThree(num, num2) {
    return num - (num % num2);
  }
  transform(items: any[], number): any {
    let counter = 0;
    if (items && items.length > 0) {
      let itemGroups = [];
      if (items.length > 2) {
        for (
          let i = 0;
          i < this.roundDownToNearestMultipleOfThree(items.length, number) - 1;
          i += number
        ) {
          itemGroups.push(items.slice(i, i + number));
        }
      } else {
        for (let i = 0; i < items.length; i++) {
          itemGroups.push(items.slice(i, i + 1));
        }
      }
      return itemGroups;
    }
  }
  ngOnDestroy(): void {
    this.subcribe.unsubscribe();
  }
}
