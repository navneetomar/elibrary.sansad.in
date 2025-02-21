import { Component } from '@angular/core';
import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { Topic } from '../../../../core/shared/topic.model';
import { TopicSearchResult } from '../../../object-collection/shared/topic-search-result.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { Subscription, Subject } from 'rxjs';
import { SearchResultLogoService } from '../search-result-logo.service';
import { TruncatableService } from 'src/app/shared/truncatable/truncatable.service';
import { DSONameService } from 'src/app/core/breadcrumbs/dso-name.service';

@Component({
  selector: 'ds-topic-search-result-list-element',
  styleUrls: [
    '../search-result-list-element.component.scss',
    'topic-search-result-list-element.component.scss',
  ],
  templateUrl: 'topic-search-result-list-element.component.html',
})
/**
 * Component representing a community search result in list view
 */
@listableObjectComponent(TopicSearchResult, ViewMode.ListElement)
export class TopicSearchResultListElementComponent extends SearchResultListElementComponent<
  TopicSearchResult,
  Topic
> {
  /**
   * Display thumbnails if required by configuration
   */
  logo$ = new Subject<string>();
  showThumbnails = true;
  itemPageRoute: string;
  subcribe: Subscription;
  logoTopic = '../../../../../assets/images/cover_book_enhira.png';

  constructor(
    private searchResultLogoService: SearchResultLogoService,
    protected truncatableService: TruncatableService,
    protected dsoNameService: DSONameService
  ) {
    super(truncatableService, dsoNameService);
  }
  ngOnInit(): void {
    super.ngOnInit();
    // this.showThumbnails = this.appConfig.browseBy.showThumbnails;
    // console.log(this.dso)
    this.subcribe = this.searchResultLogoService
      .getLogoByType(this.dso.id, 'topics')
      .subscribe((data) => {

        this.logo$.next(data);

        if (
          data &&
          data._embedded &&
          data._embedded.logo &&
          data._embedded.logo._links
        ) {
          this.logoTopic = data._embedded.logo._links.content.href;
        } else {
          this.logoTopic = '../../../../../assets/images/cover_book_enhira.png';
        }
      });
  }
  ngOnDestroy() {
    this.subcribe.unsubscribe();
  }
}
