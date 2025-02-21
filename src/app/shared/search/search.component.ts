import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  HostListener,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
} from 'rxjs/operators';
import uniqueId from 'lodash/uniqueId';
import { getCollectionPageRoute } from '../../collection-page/collection-page-routing-paths';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { pushInOut } from '../animations/push';
import { HostWindowService } from '../host-window.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { hasValue } from '../empty.util';
import { RouteService } from '../../core/services/route.service';
import { SEARCH_CONFIG_SERVICE } from '../../my-dspace-page/my-dspace-page.component';
import { PaginatedSearchOptions } from './models/paginated-search-options.model';
import { SearchResult } from './models/search-result.model';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { SearchService } from '../../core/shared/search/search.service';
import { currentPath } from '../utils/route.utils';
import { Context } from '../../core/shared/context.model';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { SearchConfig } from '../../core/shared/search/search-filters/search-config.model';
import { SearchConfigurationOption } from './search-switch-configuration/search-configuration-option.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { followLink } from '../utils/follow-link-config.model';
import { Item } from '../../core/shared/item.model';
import { SearchObjects } from './models/search-objects.model';
import { ViewMode } from '../../core/shared/view-mode.model';
import { SelectionConfig } from './search-results/search-results.component';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { CollectionElementLinkType } from '../object-collection/collection-element-link.type';
import { environment } from 'src/environments/environment';
import { SubmissionObject } from '../../core/submission/models/submission-object.model';
import { SearchFilterConfig } from './models/search-filter-config.model';
import { Breadcrumb } from 'src/app/breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsService } from 'src/app/breadcrumbs/breadcrumbs.service';
import { ComColPageNavOption } from '../comcol/comcol-page-browse-by/comcol-page-browse-by.component';
import { BrowseDefinition } from 'src/app/core/shared/browse-definition.model';
import { BrowseService } from 'src/app/core/browse/browse.service';
import { Collection } from 'src/app/core/shared/collection.model';
import { redirectOn4xx } from 'src/app/core/shared/authorized.operators';
import { AuthService } from 'src/app/core/auth/auth.service';
import { getCommunityPageRoute } from 'src/app/community-page/community-page-routing-paths';
import { Location } from '@angular/common';

@Component({
  selector: 'ds-search',
  styleUrls: ['./search.component.scss'],
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut],
})

/**
 * This component renders a sidebar, a search input bar and the search results.
 */
export class SearchComponent implements OnInit{

  /**
   * The list of available configuration options
   */
  @Input() configurationList: SearchConfigurationOption[] = [];

  /**
   * The current context
   * If empty, 'search' is used
   */
  @Input() context: Context = Context.Search;

  /**
   * The configuration to use for the search options
   * If empty, 'default' is used
   */
  @Input() configuration = 'default';

  @Input()isAuthorProfileSearch  = false;

  /**
   * The actual query for the fixed filter.
   * If empty, the query will be determined by the route parameter called 'filter'
   */
  @Input() fixedFilterQuery: string;

  /**
   * If this is true, the request will only be sent if there's
   * no valid cached version. Defaults to true
   */
  @Input() useCachedVersionIfAvailable = true;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch = true;

  /**
   * The link type of the listed search results
   */
  @Input() linkType: CollectionElementLinkType;

  /**
   * The pagination id used in the search
   */
  @Input() paginationId = 'spc';

  /**
   * Whether or not the search bar should be visible
   */
  @Input() searchEnabled = true;

  /**
   * The width of the sidebar (bootstrap columns)
   */
  @Input() sideBarWidth = 3;

  /**
   * The placeholder of the search form input
   */
  @Input() searchFormPlaceholder = 'search.search-form.placeholder';

  /**
   * A boolean representing if result entries are selectable
   */
  @Input() selectable = false;

  /**
   * The config option used for selection functionality
   */
  @Input() selectionConfig: SelectionConfig;

  /**
   * A boolean representing if show search sidebar button
   */
  @Input() showSidebar = true;

  /**
   * Whether to show the view mode switch
   */
  @Input() showViewModes = true;

  /**
   * List of available view mode
   */
  @Input() useUniquePageId: false;

  /**
   * List of available view mode
   */
  @Input() viewModeList: ViewMode[];

  /**
   * Defines whether or not to show the scope selector
   */
  @Input() showScopeSelector = true;

  /**
   * Whether or not to track search statistics by sending updates to the rest api
   */
  @Input() trackStatistics = false;

  /**
   * The current configuration used during the search
   */
  currentConfiguration$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  /**
   * The current context used during the search
   */
  currentContext$: BehaviorSubject<Context> = new BehaviorSubject<Context>(
    null
  );

  /**
   * The current sort options used
   */
  currentScope$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * The current sort options used
   */
  currentSortOptions$: BehaviorSubject<SortOptions> =
    new BehaviorSubject<SortOptions>(null);

  /**
   * An observable containing configuration about which filters are shown and how they are shown
   */
  filtersRD$: BehaviorSubject<RemoteData<SearchFilterConfig[]>> =
    new BehaviorSubject<RemoteData<SearchFilterConfig[]>>(null);

  /**
   * Maintains the last search options, so it can be used in refresh
   */
  lastSearchOptions: PaginatedSearchOptions;

  /**
   * The current search results
   */
  resultsRD$: BehaviorSubject<
    RemoteData<PaginatedList<SearchResult<DSpaceObject>>>
  > = new BehaviorSubject(null);

  /**
   * The current paginated search options
   */
  searchOptions$: BehaviorSubject<PaginatedSearchOptions> =
    new BehaviorSubject<PaginatedSearchOptions>(null);

  /**
   * The available sort options list
   */
  sortOptionsList$: BehaviorSubject<SortOptions[]> = new BehaviorSubject<
    SortOptions[]
  >([]);

  /**
   * TRUE if the search option are initialized
   */
  initialized$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Observable for whether or not the sidebar is currently collapsed
   */
  isSidebarCollapsed$: Observable<boolean>;

  /**
   * Emits true if were on a small screen
   */
  isXsOrSm$: Observable<boolean>;

  /**
   * Emits when the search filters values may be stale, and so they must be refreshed.
   */
  refreshFilters: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Link to the search page
   */
  searchLink: string;

  /**
   * Subscription to unsubscribe from
   */
  sub: Subscription;


  allOptions: ComColPageNavOption[];


  /**
   * Emits an event with the current search result entries
   */
  @Output() resultFound: EventEmitter<SearchObjects<DSpaceObject>> =
    new EventEmitter<SearchObjects<DSpaceObject>>();

  /**
   * Emits event when the user deselect result entry
   */
  @Output() deselectObject: EventEmitter<ListableObject> =
    new EventEmitter<ListableObject>();

  /**
   * Emits event when the user select result entry
   */
  @Output() selectObject: EventEmitter<ListableObject> =
    new EventEmitter<ListableObject>();
    breadcrumbs$: Observable<Breadcrumb[]>;
    showBreadcrumbs$: Observable<boolean>;
    isCollectionDetails: boolean;
    currentOptionId$: Observable<any>;
    collectionRD$: Observable<unknown>;
    desc: any;
    titleBanner: any;
    logoRD$: Observable<unknown>;
    mainTitle = 'Search';
    contentType: string;
    isShowBanner = true;

  constructor(
    protected service: SearchService,
    protected sidebarService: SidebarService,
    protected windowService: HostWindowService,
    @Inject(SEARCH_CONFIG_SERVICE)
    public searchConfigService: SearchConfigurationService,
    protected routeService: RouteService,
    protected router: Router,
    protected breadcrumbsService: BreadcrumbsService,
    protected route: ActivatedRoute,
    protected browseService: BrowseService,
    protected authService: AuthService,
    protected location: Location,


  ) {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
    this.breadcrumbs$ = breadcrumbsService.breadcrumbs$;
    this.showBreadcrumbs$ = breadcrumbsService.showBreadcrumbs$;
  }

  /**
   * Listening to changes in the paginated search options
   * If something changes, update the search results
   *
   * Listen to changes in the scope
   * If something changes, update the list of scopes for the dropdown
   */
  ngOnInit(): void {
    this.getQueryParam();
    if (this.useUniquePageId) {
      // Create an unique pagination id related to the instance of the SearchComponent
      this.paginationId = uniqueId(this.paginationId);
    }

    this.searchConfigService.setPaginationId(this.paginationId);

    if (hasValue(this.configuration)) {
      this.routeService.setParameter('configuration', this.configuration);
    }
    if (hasValue(this.fixedFilterQuery)) {
      this.routeService.setParameter('fixedFilterQuery', this.fixedFilterQuery);
    }

    this.isSidebarCollapsed$ = this.isSidebarCollapsed();
    this.searchLink = this.getSearchLink();
    this.currentContext$.next(this.context);

    // Determinate PaginatedSearchOptions and listen to any update on it
    const configuration$: Observable<string> = this.searchConfigService
      .getCurrentConfiguration(this.configuration)
      .pipe(distinctUntilChanged());
    const searchSortOptions$: Observable<SortOptions[]> = configuration$.pipe(
      switchMap((configuration: string) =>
        this.searchConfigService.getConfigurationSearchConfig(configuration)
      ),
      map((searchConfig: SearchConfig) =>
        this.searchConfigService.getConfigurationSortOptions(searchConfig)
      ),
      distinctUntilChanged()
    );
    const sortOption$: Observable<SortOptions> = searchSortOptions$.pipe(
      switchMap((searchSortOptions: SortOptions[]) => {
        const defaultSort: SortOptions = searchSortOptions[0];
        return this.searchConfigService.getCurrentSort(
          this.paginationId,
          defaultSort
        );
      }),
      distinctUntilChanged()
    );
    const searchOptions$: Observable<PaginatedSearchOptions> =
      this.getSearchOptions().pipe(distinctUntilChanged());

    this.sub = combineLatest([
      configuration$,
      searchSortOptions$,
      searchOptions$,
      sortOption$,
    ])
      .pipe(
        filter(
          ([configuration, searchSortOptions, searchOptions, sortOption]: [
            string,
            SortOptions[],
            PaginatedSearchOptions,
            SortOptions
          ]) => {
            // filter for search options related to instanced paginated id
            return searchOptions.pagination.id === this.paginationId;
          }
        ),
        debounceTime(100)
      )
      .subscribe(
        ([configuration, searchSortOptions, searchOptions, sortOption]: [
          string,
          SortOptions[],
          PaginatedSearchOptions,
          SortOptions
        ]) => {
          // Build the PaginatedSearchOptions object
          const combinedOptions = Object.assign({}, searchOptions, {
            configuration: searchOptions.configuration || configuration,
            sort: sortOption || searchOptions.sort,
          });
          const newSearchOptions = new PaginatedSearchOptions(combinedOptions);
          // check if search options are changed
          // if so retrieve new related results otherwise skip it
          if (
            JSON.stringify(newSearchOptions) !==
            JSON.stringify(this.searchOptions$.value)
          ) {
            // Initialize variables
            this.currentConfiguration$.next(configuration);
            this.currentSortOptions$.next(newSearchOptions.sort);
            this.currentScope$.next(newSearchOptions.scope);
            this.sortOptionsList$.next(searchSortOptions);
            this.searchOptions$.next(newSearchOptions);
            this.initialized$.next(true);
            // retrieve results
            this.retrieveSearchResults(newSearchOptions);
            this.retrieveFilters(searchOptions);
          }
        }
      );

     
      if (this.location.path().includes('/mydspace')){
        this.isShowBanner = false;
      }
  }
  /**
   * Change the current context
   * @param context
   */
  public changeContext(context: Context) {
    this.currentContext$.next(context);
  }

  /**
   * Set the sidebar to a collapsed state
   */
  public closeSidebar(): void {
    this.sidebarService.collapse();
  }

  /**
   * Reset result list on view mode change
   */
  public changeViewMode() {
    this.resultsRD$.next(null);
  }

  /**
   * Set the sidebar to an expanded state
   */
  public openSidebar(): void {
    this.sidebarService.expand();
  }

  /**
   * Emit event to refresh filter content
   * @param $event
   */
  public onContentChange($event: any) {
    this.retrieveFilters(this.lastSearchOptions);
    this.refreshFilters.next(true);
  }

  /**
   * Get the current paginated search options
   * @returns {Observable<PaginatedSearchOptions>}
   */
  protected getSearchOptions(): Observable<PaginatedSearchOptions> {
    return this.searchConfigService.paginatedSearchOptions;
  }

  /**
   * Retrieve search filters by the given search options
   * @param searchOptions
   * @private
   */
  private retrieveFilters(searchOptions: PaginatedSearchOptions) {
    this.filtersRD$.next(null);
    this.searchConfigService
      .getConfig(searchOptions.scope, searchOptions.configuration)
      .pipe(getFirstCompletedRemoteData())
      .subscribe((filtersRD: RemoteData<SearchFilterConfig[]>) => {
        this.filtersRD$.next(filtersRD);
      });
  }

  /**
   * Retrieve search result by the given search options
   * @param searchOptions
   * @private
   */
  private retrieveSearchResults(searchOptions: PaginatedSearchOptions) {
    this.resultsRD$.next(null);
    this.lastSearchOptions = searchOptions;
    this.service
      .search(
        searchOptions,
        undefined,
        this.useCachedVersionIfAvailable,
        true,
        followLink<Item>('thumbnail', { isOptional: true }),
        followLink<SubmissionObject>(
          'item',
          { isOptional: true },
          followLink<Item>('thumbnail', { isOptional: true })
        ) as any,
        followLink<Item>('accessStatus', {
          isOptional: true,
          shouldEmbed: environment.item.showAccessStatuses,
        })
      )
      .pipe(getFirstCompletedRemoteData())
      .subscribe((results: RemoteData<SearchObjects<DSpaceObject>>) => {
        if (results.hasSucceeded) {
          if (this.trackStatistics) {
            this.service.trackSearch(searchOptions, results.payload);
          }
          if (results.payload?.page?.length > 0) {
            this.resultFound.emit(results.payload);
          }
        }
        this.resultsRD$.next(results);
      });
  }

  /**
   * Check if the sidebar is collapsed
   * @returns {Observable<boolean>} emits true if the sidebar is currently collapsed, false if it is expanded
   */
  private isSidebarCollapsed(): Observable<boolean> {
    return this.sidebarService.isCollapsed;
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  private getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.service.getSearchLink();
  }

  scrollToPosition() {
    // Replace 'yourDesiredPosition' with the desired vertical scroll position
    const yourDesiredPosition = 800; // For example, scroll to 500 pixels from the top
    window.scrollTo(0, yourDesiredPosition);
  }
  getQueryParam() {
    this.route.queryParams
      .subscribe(params => {
        // console.log(params); // { orderby: "price" }
        if (params && params.scope && params.scope !== '') {
          this.isCollectionDetails = true;
          this.getComCol(params.scope);
          this.getCollectionDetails();
        }
      }
    );
  }


  getComCol(collecionId) {
    this.browseService.getBrowseDefinitions()
    .pipe(getFirstCompletedRemoteData<PaginatedList<BrowseDefinition>>())
    .subscribe((browseDefListRD: RemoteData<PaginatedList<BrowseDefinition>>) => {

      // console.log(browseDefListRD)
      if (browseDefListRD.hasSucceeded) {
        this.allOptions = browseDefListRD.payload.page
          .map((config: BrowseDefinition) => ({
            id: config.id,
            label: `browse.comcol.by.${config.id}`,
            routerLink: `/browse/${config.id}`,
            params: { scope: collecionId }
          }));

          if (this.contentType === 'collection') {
            this.allOptions = [{
              id: collecionId,
              label: 'collection.page.browse.recent.head',
              routerLink: getCollectionPageRoute(collecionId)
            }, ...this.allOptions];
          } else if (this.contentType === 'community') {
            this.allOptions = [{
              id: collecionId,
              label: 'community.all-lists.head',
              routerLink: getCommunityPageRoute(collecionId)
            }, ...this.allOptions];
          }

          // console.log(this.allOptions)

      }
    });
  this.currentOptionId$ = this.route.params.pipe(
    map((params: Params) => params.id)
  );
  }

  getCollectionDetails() {
    // console.log('get details')
    this.collectionRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Collection>),
      redirectOn4xx(this.router, this.authService),
      take(1)
    );
    this.collectionRD$.subscribe((res: any) => {
      // console.log(res)
      if (res && res.payload){
        this.desc = res.payload.firstMetadataValue('dc.description');
        this.titleBanner = res.payload.firstMetadataValue('dc.title');
      }
    });
    this.logoRD$ = this.collectionRD$.pipe(
      map((rd: RemoteData<Collection>) => rd.payload),
      filter((collection: Collection) => hasValue(collection)),
      mergeMap((collection: Collection) => collection.logo)
    );
  }
  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
    this.isShowBanner = true;
  }
}
