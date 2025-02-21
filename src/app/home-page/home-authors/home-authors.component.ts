import { Observable, Subscription, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
import { NgbCarousel, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-home-authors',
  styleUrls: ['./home-authors.component.scss'],
  templateUrl: './home-authors.component.html',
})

/**
 * Component to render the news section on the home page
 */
export class HomeAuthorsComponent implements OnInit, OnDestroy {
  @ViewChild('carousel', { static: true }) carousel: NgbCarousel;
  public results$: Observable<any>;
  public dataResult: any;
  logoDefault = '../../../../../assets/images/cover_book_enhira.png';
  subcription: Subscription;
  images = [62, 83, 466, 965, 982, 1043, 738].map(
    (n) => `https://picsum.photos/id/${n}/900/500`
  );

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;

  constructor(
    public http: HttpClient,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {}
  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }
  ngOnInit(): void {
    this.results$ = this.getAuthorsHomePage(0).pipe(map((data) => data));
    this.subcription = this.results$.subscribe(
      (data) =>
        (this.dataResult = data?._embedded?.searchResult?._embedded?.objects)
    );
  }

  getAuthorsHomePage(page: number): Observable<any> {
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/discover/search/objects?sort=score,DESC&page=${page}&size=10&configuration=default&f.entityType=Person,equals&embed=thumbnail&embed=item%2Fthumbnail`
    );
  }
  onSlide(slideEvent: NgbSlideEvent) {
    console.log('sidle');
  }
}
