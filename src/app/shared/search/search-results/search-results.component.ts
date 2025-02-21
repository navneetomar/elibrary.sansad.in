import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RemoteData } from '../../../core/data/remote-data';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { fadeIn, fadeInOut } from '../../animations/fade';
import { SearchResult } from '../models/search-result.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { hasNoValue, isNotEmpty } from '../../empty.util';
import { SortOptions } from '../../../core/cache/models/sort-options.model';
import { ListableObject } from '../../object-collection/shared/listable-object.model';
import { CollectionElementLinkType } from '../../object-collection/collection-element-link.type';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { Context } from '../../../core/shared/context.model';
import { PaginatedSearchOptions } from '../models/paginated-search-options.model';
import { ActivatedRoute } from '@angular/router';

export interface SelectionConfig {
  repeatable: boolean;
  listId: string;
}

@Component({
  selector: 'ds-search-results',
  templateUrl: './search-results.component.html',
  animations: [
    fadeIn,
    fadeInOut
  ]
})

/**
 * Component that represents all results from a search
 */
export class SearchResultsComponent implements OnInit {
  isCollectionDetails: boolean;

  constructor(
    protected route: ActivatedRoute,
  ) {
    
  }
  hasNoValue = hasNoValue;

  /**
   * The link type of the listed search results
   */
  @Input() linkType: CollectionElementLinkType;

  /**
   * The actual search result objects
   */
  @Input() searchResults: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>;

  /**
   * The current configuration of the search
   */
  @Input() searchConfig: PaginatedSearchOptions;

  /**
   * The current sorting configuration of the search
   */
  @Input() sortConfig: SortOptions;

  /**
   * The current view-mode of the list
   */
  @Input() viewMode: ViewMode;

  /**
   * An optional configuration to filter the result on one type
   */
  @Input() configuration: string;

  /**
   * Whether or not to hide the header of the results
   * Defaults to a visible header
   */
  @Input() disableHeader = false;

  /**
   * A boolean representing if result entries are selectable
   */
  @Input() selectable = false;

  @Input() context: Context;

  /**
   * Option for hiding the pagination detail
   */
  @Input() hidePaginationDetail = false;

  /**
   * The config option used for selection functionality
   */
  @Input() selectionConfig: SelectionConfig = null;

  /**
   * Emit when one of the listed object has changed.
   */
  @Output() contentChange = new EventEmitter<any>();

  @Output() deselectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

  @Output() selectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

  @Output() isSearchPage = true;


  ngOnInit(): void {
      this.getQueryParam();
  }
  /**
   * Check if search results are loading
   */
  isLoading() {
    return !this.showError() && (hasNoValue(this.searchResults) || hasNoValue(this.searchResults.payload) || this.searchResults.isLoading);
  }

  showError(): boolean {
    return this.searchResults?.hasFailed && (!this.searchResults?.errorMessage || this.searchResults?.statusCode !== 400);
  }

  errorMessageLabel(): string {
    return (this.searchResults?.statusCode  === 422) ? 'error.invalid-search-query' : 'error.search-results';
  }

  /**
   * Method to change the given string by surrounding it by quotes if not already present.
   */
  surroundStringWithQuotes(input: string): string {
    let result = input;

    if (isNotEmpty(result) && !(result.startsWith('\"') && result.endsWith('\"'))) {
      result = `"${result}"`;
    }

    return result;
  }


  getQueryParam() {
    this.route.queryParams
      .subscribe(params => {
        // console.log(params); // { orderby: "price" }

        if(params && params.scope && params.scope !== '') {
          this.isCollectionDetails = true;
        }
      }
    );
  }
}
