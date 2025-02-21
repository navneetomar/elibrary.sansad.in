import { Subscription } from 'rxjs/internal/Subscription';
import { ViewItemListService } from './view-item-list.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  NgbCarousel,
  NgbCarouselModule,
  NgbSlideEvent,
  NgbSlideEventSource,
} from '@ng-bootstrap/ng-bootstrap';
import { from, map, Observable } from 'rxjs';

@Component({
  selector: 'ds-view-item-list',
  templateUrl: './view-item-list.component.html',
  styleUrls: ['./view-item-list.component.scss'],
})
export class ViewItemListComponent implements OnInit, OnDestroy {
  @ViewChild('carousel', { static: true }) carousel: NgbCarousel;
  public results$: Observable<any>;
  public listItemTopView: any;
  subcribe: Subscription;
  carouselCounter = 3;
  itemsGroup = [];
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;

  constructor(private topViewItemService: ViewItemListService) {}
  ngOnInit(): void {
    // this.results$ = this.topViewItemService.getListTopItemView().pipe(
    //   map((data) => {
    //     this.listItemTopView = this.transform(
    //       data._embedded.usagereports[0].points,
    //       this.carouselCounter
    //     );
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
    if (items && items.length > 0) {
      let itemGroups = [];
      for (
        let i = 0;
        i < this.roundDownToNearestMultipleOfThree(items.length, number) - 1;
        i += number
      ) {
        itemGroups.push(items.slice(i, i + number));
      }
      return itemGroups;
    }
  }
  ngOnDestroy(): void {
    this.subcribe.unsubscribe();
  }
}
