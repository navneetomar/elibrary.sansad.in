import {Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, combineLatest as observableCombineLatest, Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import { Breadcrumb } from 'src/app/breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsService } from 'src/app/breadcrumbs/breadcrumbs.service';
import {SortDirection, SortOptions} from '../../core/cache/models/sort-options.model';
import {PaginatedList} from '../../core/data/paginated-list.model';
import {RemoteData} from '../../core/data/remote-data';
import {PaginationService} from '../../core/pagination/pagination.service';
import {RouteService} from '../../core/services/route.service';
import {ViewMode} from '../../core/shared/view-mode.model';
import {fadeIn, fadeInOut} from '../animations/fade';
import {hasValue} from '../empty.util';
import {ListableObject} from '../object-collection/shared/listable-object.model';
import {PaginationComponentOptions} from '../pagination/pagination-component-options.model';
import {getStartsWithComponent, StartsWithType} from '../starts-with/starts-with-decorator';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';

@Component({
  selector: 'ds-browse-by',
  styleUrls: ['./browse-by.component.scss'],
  templateUrl: './browse-by.component.html',
  animations: [
    fadeIn,
    fadeInOut
  ]
})
/**
 * Component to display a browse-by page for any ListableObject
 */
export class BrowseByComponent implements OnInit, OnDestroy {

  /**
   * ViewMode that should be passed to {@link ListableObjectComponentLoaderComponent}.
   */
  viewMode: ViewMode = ViewMode.ListElement;

  /**
   * The i18n message to display as title
   */
  @Input() title: string;

  /**
   * The parent name
   */
  @Input() parentname: string;
  /**
   * The list of objects to display
   */
  @Input() objects$: Observable<RemoteData<PaginatedList<ListableObject>>>;

  /**
   * The pagination configuration used for the list
   */
  @Input() paginationConfig: PaginationComponentOptions;

  /**
   * The sorting configuration used for the list
   */
  @Input() sortConfig: SortOptions;

  /**
   * The type of StartsWith options used to define what component to render for the options
   * Defaults to text
   */
  @Input() type = StartsWithType.text;

  /**
   * The list of options to render for the StartsWith component
   */
  @Input() startsWithOptions = [];

  /**
   * Whether or not the pagination should be rendered as simple previous and next buttons instead of the normal pagination
   */
  @Input() showPaginator = true;

  /**
   * It is used to hide or show gear
   */
  @Input() hideGear = false;

  /**
   * Emits event when prev button clicked
   */
  @Input() descBanner : any;

  @Output() prev = new EventEmitter<boolean>();

  /**
   * Emits event when next button clicked
   */
  @Output() next = new EventEmitter<boolean>();

  /**
   * Emits event when page size is changed
   */
  @Output() pageSizeChange = new EventEmitter<number>();

  /**
   * Emits event when page sort direction is changed
   */
  @Output() sortDirectionChange = new EventEmitter<SortDirection>();

  @Output() isBrowserBy = true;

  /**
   * An object injector used to inject the startsWithOptions to the switchable StartsWith component
   */
  objectInjector: Injector;

  /**
   * Declare SortDirection enumeration to use it in the template
   */
  public sortDirections = SortDirection;

  /**
   * Observable that tracks if the back button should be displayed based on the path parameters
   */
  shouldDisplayResetButton$: Observable<boolean>;

  /**
   * Page number of the previous page
   */
  previousPage$ = new BehaviorSubject<string>('1');

  /**
   * Subscription that has to be unsubscribed from on destroy
   */
  sub: Subscription;
  breadcrumbs$: Observable<Breadcrumb[]>;
  showBreadcrumbs$: Observable<boolean>;
  hasHeaderResult:boolean = true;
  noScope: boolean = false;

  public constructor(private injector: Injector,
                     protected paginationService: PaginationService,
                     private routeService: RouteService,
                     private breadcrumbsService: BreadcrumbsService,
  ) {
    this.breadcrumbs$ = breadcrumbsService.breadcrumbs$;
    this.showBreadcrumbs$ = breadcrumbsService.showBreadcrumbs$;
  }

  /**
   * Go to the previous page
   */
  goPrev() {
    this.prev.emit(true);
  }

  /**
   * Go to the next page
   */
  goNext() {
    this.next.emit(true);
  }

  /**
   * Change the page size
   * @param size
   */
  doPageSizeChange(size) {
    this.paginationService.updateRoute(this.paginationConfig.id,{pageSize: size});
  }

  /**
   * Change the sort direction
   * @param direction
   */
  doSortDirectionChange(direction) {
    this.paginationService.updateRoute(this.paginationConfig.id,{sortDirection: direction});
  }

  /**
   * Get the switchable StartsWith component dependant on the type
   */
  getStartsWithComponent() {
    return getStartsWithComponent(this.type);
  }

  ngOnInit(): void {
    this.objectInjector = Injector.create({
      providers: [
        { provide: 'startsWithOptions', useFactory: () => (this.startsWithOptions), deps:[] },
        { provide: 'paginationId', useFactory: () => (this.paginationConfig?.id), deps:[] }
      ],
      parent: this.injector
    });

    const startsWith$ = this.routeService.getQueryParameterValue('startsWith');
    const value$ = this.routeService.getQueryParameterValue('value');

    this.shouldDisplayResetButton$ = observableCombineLatest([startsWith$, value$]).pipe(
      map(([startsWith, value]) => hasValue(startsWith) || hasValue(value))
    );
    this.sub = this.routeService.getQueryParameterValue(this.paginationConfig.id + '.return').subscribe(this.previousPage$);
    
    this.title = this.title.replace('Browsing','Exploring');
    let lowerTitle = this.title.toLowerCase();
    if(lowerTitle.includes('type')){
      this.hasHeaderResult = false;
    }
    this.checkHasScope();
  }

  /**
   * Navigate back to the previous browse by page
   */
  back() {
    const page = +this.previousPage$.value > 1 ? +this.previousPage$.value : 1;
    this.paginationService.updateRoute(this.paginationConfig.id, {page: page}, {[this.paginationConfig.id + '.return']: null, value: null, startsWith: null});
  }
  checkHasScope(){
    if (typeof window !== 'undefined'){
      let url = window.location.href;
      // console.log(url)
      if(url.includes('scope')){
        this.noScope = true;
      }
    }
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
