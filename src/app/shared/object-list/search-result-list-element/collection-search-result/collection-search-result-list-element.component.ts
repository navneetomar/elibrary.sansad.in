import { Subject, Subscription } from 'rxjs';
import { Component, Input } from '@angular/core';
import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { Collection } from '../../../../core/shared/collection.model';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { SearchResultLogoService } from '../search-result-logo.service';
import { TruncatableService } from 'src/app/shared/truncatable/truncatable.service';
import { DSONameService } from 'src/app/core/breadcrumbs/dso-name.service';

@Component({
  selector: 'ds-collection-search-result-list-element',
  styleUrls: [
    '../search-result-list-element.component.scss',
    'collection-search-result-list-element.component.scss',
  ],
  templateUrl: 'collection-search-result-list-element.component.html',
})
/**
 * Component representing a collection search result in list view
 */
@listableObjectComponent(CollectionSearchResult, ViewMode.ListElement)
export class CollectionSearchResultListElementComponent extends SearchResultListElementComponent<
  CollectionSearchResult,
  Collection
> {
  /**
   * Display thumbnails if required by configuration
   */
  @Input() isRecentItem: boolean;
  fullTime: string;
  constructor(
    private searchResultLogoService: SearchResultLogoService,
    protected truncatableService: TruncatableService,
    protected dsoNameService: DSONameService
  ) {
    super(truncatableService, dsoNameService);
  }
  logo$ = new Subject<string>();
  showThumbnails = true;
  itemPageRoute: string;
  subcribe: Subscription;
  logoCollection = '../../../../../assets/images/cover_book_enhira.png';

  ngOnInit(): void {
    super.ngOnInit();
   
    this.subcribe = this.searchResultLogoService
      .getLogoByType(this.dso.id, 'collections')
      .subscribe((data) => {
       
        this.logo$.next(data);

        if (
          data &&
          data._embedded &&
          data._embedded.logo &&
          data._embedded.logo._links
        ) {
          this.logoCollection = data._embedded.logo._links.content.href;
        } else {
          this.logoCollection =
            '../../../../../assets/images/cover_book_enhira.png';
        }
      });
      if(this.dso.firstMetadataValue('dc.date.issued')){
        this.fullTime = this.convertDate(this.dso.firstMetadataValue('dc.date.issued'))
      }

  }
  ngOnDestroy() {
    this.subcribe.unsubscribe();
  }
  convertDate(time){
    
    let date = new Date(time);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    let day = date.getDate();
    let month = monthNames[date.getMonth()];
    let year = date.getFullYear();
    let fullTime = `${day}-${month}-${year}`
    // console.log(fullTime);
    return fullTime
  }
}
