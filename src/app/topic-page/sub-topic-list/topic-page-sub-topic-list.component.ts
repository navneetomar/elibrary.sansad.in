import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
} from 'rxjs';

import { RemoteData } from '../../core/data/remote-data';
import { Topic } from '../../core/shared/topic.model';
import { fadeIn } from '../../shared/animations/fade';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import {
  SortDirection,
  SortOptions,
} from '../../core/cache/models/sort-options.model';
import { TopicDataService } from '../../core/data/topic-data.service';
import { takeUntilCompletedRemoteData } from '../../core/shared/operators';
import { switchMap } from 'rxjs/operators';
import { PaginationService } from '../../core/pagination/pagination.service';
import { hasValue } from '../../shared/empty.util';

@Component({
  selector: 'ds-topic-page-sub-topic-list',
  styleUrls: ['./topic-page-sub-topic-list.component.scss'],
  templateUrl: './topic-page-sub-topic-list.component.html',
  animations: [fadeIn],
})
/**
 * Component to render the sub-communities of a Community
 */
export class TopicPageSubTopicListComponent implements OnInit, OnDestroy {
  @Input() topic: Topic;

  /**
   * Optional page size. Overrides communityList.pageSize configuration for this component.
   * Value can be added in the themed version of the parent component.
   */
  @Input() pageSize: number;

  /**
   * The pagination configuration
   */
  config: PaginationComponentOptions;

  /**
   * The pagination id
   */
  pageId = 'cmscm';

  /**
   * The sorting configuration
   */
  sortConfig: SortOptions;

  /**
   * A list of remote data objects of communities' collections
   */
  subTopicsRDObs: BehaviorSubject<RemoteData<PaginatedList<Topic>>> =
    new BehaviorSubject<RemoteData<PaginatedList<Topic>>>({} as any);

  constructor(
    private cds: TopicDataService,
    private paginationService: PaginationService
  ) {}

  ngOnInit(): void {
    this.config = new PaginationComponentOptions();
    this.config.id = this.pageId;
    if (hasValue(this.pageSize)) {
      this.config.pageSize = this.pageSize;
    }
    this.config.currentPage = 1;
    this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);
    this.initPage();
  }

  /**
   * Update the list of sub-communities
   */
  initPage() {
    const pagination$ = this.paginationService.getCurrentPagination(
      this.config.id,
      this.config
    );
    const sort$ = this.paginationService.getCurrentSort(
      this.config.id,
      this.sortConfig
    );

    observableCombineLatest([pagination$, sort$])
      .pipe(
        switchMap(([currentPagination, currentSort]) => {
          return this.cds.findByParent(this.topic.id, {
            currentPage: currentPagination.currentPage,
            elementsPerPage: currentPagination.pageSize,
            sort: {
              field: currentSort.field,
              direction: currentSort.direction,
            },
          });
        })
      )
      .subscribe((results) => {
        this.subTopicsRDObs.next(results);
      });

    this.cds
      .findByParent(this.topic.id, {
        currentPage: this.config.currentPage,
        elementsPerPage: this.config.pageSize,
        sort: {
          field: this.sortConfig.field,
          direction: this.sortConfig.direction,
        },
      })
      .pipe(takeUntilCompletedRemoteData())
      .subscribe((results) => {
        this.subTopicsRDObs.next(results);
      });
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.config.id);
  }
}
