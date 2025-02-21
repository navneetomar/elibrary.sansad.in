import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
  Observable,
  Subject,
} from 'rxjs';
import {
  filter,
  map,
  mergeMap,
  startWith,
  switchMap,
  take,
} from 'rxjs/operators';
import { PaginatedSearchOptions } from '../shared/search/models/paginated-search-options.model';
import { SearchService } from '../core/shared/search/search.service';
import {
  SortDirection,
  SortOptions,
} from '../core/cache/models/sort-options.model';
import { CollectionDataService } from '../core/data/collection-data.service';
import { PaginatedList } from '../core/data/paginated-list.model';
import { RemoteData } from '../core/data/remote-data';
import { Bitstream } from '../core/shared/bitstream.model';

import { Collection } from '../core/shared/collection.model';
import { DSpaceObjectType } from '../core/shared/dspace-object-type.model';
import { Item } from '../core/shared/item.model';
import {
  getAllSucceededRemoteDataPayload,
  getFirstSucceededRemoteData,
  toDSpaceObjectListRD,
} from '../core/shared/operators';

import { fadeIn, fadeInOut } from '../shared/animations/fade';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { AuthService } from '../core/auth/auth.service';
import { PaginationService } from '../core/pagination/pagination.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { getCollectionPageRoute } from './collection-page-routing-paths';
import { redirectOn4xx } from '../core/shared/authorized.operators';
import { BROWSE_LINKS_TO_FOLLOW } from '../core/browse/browse.service';
import { Breadcrumb } from '../breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsService } from '../breadcrumbs/breadcrumbs.service';
import { HostWindowService } from '../shared/host-window.service';
import { Location } from '@angular/common';

@Component({
  selector: 'ds-collection-page',
  styleUrls: ['./collection-page.component.scss'],
  templateUrl: './collection-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn, fadeInOut],
})
export class CollectionPageComponent implements OnInit, AfterViewChecked {
  @ViewChild('myScrollContainer', { static: true }) myScrollContainer: ElementRef;
  collectionRD$: Observable<RemoteData<Collection>>;
  itemRD$: Observable<RemoteData<PaginatedList<Item>>>;
  logoRD$: Observable<RemoteData<Bitstream>>;
  paginationConfig: PaginationComponentOptions;
  sortConfig: SortOptions;



  private paginationChanges$: Subject<{
    paginationConfig: PaginationComponentOptions;
    sortConfig: SortOptions;
  }>;

  /**
   * Whether the current user is a Community admin
   */
  isCollectionAdmin$: Observable<boolean>;

  /**
   * Route to the community page
   */
  collectionPageRoute$: Observable<string>;
  breadcrumbs$: Observable<Breadcrumb[]>;
  showBreadcrumbs$: Observable<boolean>;
  isXsOrSm$: any;
  desc: string;
  titleBanner: string;
  scopeID: any;

  scrollPosition = 0;
  isScrollEvent = false;
  idColl: any;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    this.scrollPosition = window.pageYOffset;
    this.isScrollEvent = true;

  }
  constructor(
    private collectionDataService: CollectionDataService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private paginationService: PaginationService,
    private authorizationDataService: AuthorizationDataService,
    private breadcrumbsService: BreadcrumbsService,
    protected windowService: HostWindowService,
    private location: Location,

  ) {
    this.paginationConfig = new PaginationComponentOptions();
    this.paginationConfig.id = 'cp';
    this.paginationConfig.pageSize = 5;
    this.paginationConfig.currentPage = 1;
    this.sortConfig = new SortOptions(
      'dc.date.accessioned',
      SortDirection.DESC
    );
    this.breadcrumbs$ = breadcrumbsService.breadcrumbs$;
    this.showBreadcrumbs$ = breadcrumbsService.showBreadcrumbs$;
    this.isXsOrSm$ = this.windowService.isXsOrSm();

  }
  scrollToBottom(){
    if (this.myScrollContainer && this.myScrollContainer?.nativeElement && typeof window !== undefined) {
      const element = this.myScrollContainer.nativeElement;
      const scrollPosition = element.getBoundingClientRect().top;
      const offsetTop = element.offsetTop;
      const offsetHeight = element.offsetHeight;

      const offsetTopValue = this.myScrollContainer.nativeElement.offsetTop;
      window.scrollTo(0 , offsetTopValue);
    }
  }
  ngOnInit(): void {
    this.loadData();
    let path = this.location.path();
    this.idColl = path.toString().split('/')[2];
  }
  ngAfterViewChecked(): void {
    let path = this.location.path();
    if (path.toString().split('/')[2] !== this.idColl){
      this.loadData();
      this.idColl = path.toString().split('/')[2];
    }
  }
  loadData(){
    this.collectionRD$ = this.route.data.pipe(
      map((data) => {
      
        return data.dso as RemoteData<Collection>;
      }),
      redirectOn4xx(this.router, this.authService),
      take(1)
    );
    this.collectionRD$.subscribe(res => {
      
      if (res && res.payload){
        this.desc = res.payload.firstMetadataValue('dc.description');
        this.titleBanner = res.payload.firstMetadataValue('dc.title');
        this.scopeID = res.payload;
      }
    })
    this.logoRD$ = this.collectionRD$.pipe(
      map((rd: RemoteData<Collection>) => rd.payload),
      filter((collection: Collection) => hasValue(collection)),
      mergeMap((collection: Collection) => collection.logo)
    );
    this.isCollectionAdmin$ = this.authorizationDataService.isAuthorized(
      FeatureID.IsCollectionAdmin
    );

    this.paginationChanges$ = new BehaviorSubject({
      paginationConfig: this.paginationConfig,
      sortConfig: this.sortConfig,
    });

    const currentPagination$ = this.paginationService.getCurrentPagination(
      this.paginationConfig.id,
      this.paginationConfig
    );
    const currentSort$ = this.paginationService.getCurrentSort(
      this.paginationConfig.id,
      this.sortConfig
    );

    this.itemRD$ = observableCombineLatest([
      currentPagination$,
      currentSort$,
    ]).pipe(
      switchMap(([currentPagination, currentSort]) =>
        this.collectionRD$.pipe(
          getFirstSucceededRemoteData(),
          map((rd) => rd.payload.id),
          switchMap((id: string) => {
            console.log(id)
            return this.searchService
              .search<Item>(
                new PaginatedSearchOptions({
                  scope: id,
                  pagination: currentPagination,
                  sort: currentSort,
                  dsoTypes: [DSpaceObjectType.ITEM],
                }),
                null,
                true,
                true,
                ...BROWSE_LINKS_TO_FOLLOW
              )
              .pipe(toDSpaceObjectListRD()) as Observable<
              RemoteData<PaginatedList<Item>>
            >;
          }),
          startWith(undefined) // Make sure switching pages shows loading component
        )
      )
    );

    this.collectionPageRoute$ = this.collectionRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((collection) => getCollectionPageRoute(collection.id))
    );
  }
  isNotEmpty(object: any) {
    return isNotEmpty(object);
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.paginationConfig.id);
  }
}
