import { DSONameService } from 'src/app/core/breadcrumbs/dso-name.service';
import { TruncatableService } from 'src/app/shared/truncatable/truncatable.service';
import { Subject, Subscription } from 'rxjs';
import { Component, Input } from '@angular/core';
import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { Community } from '../../../../core/shared/community.model';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { SearchResultLogoService } from '../search-result-logo.service';

@Component({
  selector: 'ds-community-search-result-list-element',
  styleUrls: [
    '../search-result-list-element.component.scss',
    'community-search-result-list-element.component.scss',
  ],
  templateUrl: 'community-search-result-list-element.component.html',
})
/**
 * Component representing a community search result in list view
 */
@listableObjectComponent(CommunitySearchResult, ViewMode.ListElement)
export class CommunitySearchResultListElementComponent extends SearchResultListElementComponent<
  CommunitySearchResult,
  Community
> {
  /**
   * Display thumbnails if required by configuration
   */
  @Input() isRecentItem: boolean;
  logo$ = new Subject<string>();
  showThumbnails = true;
  itemPageRoute: string;
  subcribe: Subscription;
  logoCommunity = '../../../../../assets/images/cover_book_enhira.png';

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

    this.subcribe = this.searchResultLogoService
      .getLogoByType(this.dso.id, 'communities')
      .subscribe((data) => {
        this.logo$.next(data);

        if (
          data &&
          data._embedded &&
          data._embedded.logo &&
          data._embedded.logo._links
        ) {
          this.logoCommunity = data._embedded.logo._links.content.href;
        } else {
          this.logoCommunity =
            '../../../../../assets/images/cover_book_enhira.png';
        }
      });
  }
  ngOnDestroy() {
    this.subcribe.unsubscribe();
  }
}
