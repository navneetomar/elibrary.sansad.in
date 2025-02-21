import { mergeMap, filter, map, BehaviorSubject } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output, HostListener, ElementRef, ViewChild, AfterViewChecked
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { CommunityDataService } from '../core/data/community-data.service';
import { RemoteData } from '../core/data/remote-data';
import { Bitstream } from '../core/shared/bitstream.model';

import { Community } from '../core/shared/community.model';

import { MetadataService } from '../core/metadata/metadata.service';

import { fadeInOut } from '../shared/animations/fade';
import { hasValue } from '../shared/empty.util';
import { getAllSucceededRemoteDataPayload } from '../core/shared/operators';
import { AuthService } from '../core/auth/auth.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { getCommunityPageRoute } from './community-page-routing-paths';
import { redirectOn4xx } from '../core/shared/authorized.operators';
import { Breadcrumb } from '../breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsService } from '../breadcrumbs/breadcrumbs.service';
import { CommunityPageService } from './community-page.service';
import { Location } from '@angular/common';
import { DSpaceObjectType } from '../core/shared/dspace-object-type.model';


@Component({
  selector: 'ds-community-page',
  styleUrls: ['./community-page.component.scss'],
  templateUrl: './community-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut],
})
/**
 * This component represents a detail page for a single community
 */
export class CommunityPageComponent implements OnInit, AfterViewChecked {

  public DSpaceObjectType = DSpaceObjectType;
  /**
   * The community displayed on this page
   */
  @ViewChild('myScrollContainer', { static: true }) myScrollContainer: ElementRef;
  communityRD$: Observable<RemoteData<Community>>;

  /**
   * Whether the current user is a Community admin
   */
  isCommunityAdmin$: Observable<boolean>;

  /**
   * The logo of this community
   */
  logoRD$: Observable<RemoteData<Bitstream>>;

  /**
   * Route to the community page
   */
  communityPageRoute$: Observable<string>;

  @Output() isCommunityPage = new EventEmitter<boolean>();
  breadcrumbs$: Observable<Breadcrumb[]>;
  showBreadcrumbs$: Observable<boolean>;
  desc: any;
  titleBanner:any;

  scrollPosition = 0;
  isScrollEvent = false;
  statisticsPublications = [];
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  idComm: any;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    this.scrollPosition = window.pageYOffset;
    this.isScrollEvent = true;
  }
  constructor(
    private communityDataService: CommunityDataService,
    private metadata: MetadataService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private authorizationDataService: AuthorizationDataService,
    private breadcrumbsService: BreadcrumbsService,
    private communityPageService: CommunityPageService,
    private location: Location,
  ) {
    this.breadcrumbs$ = breadcrumbsService.breadcrumbs$;
    this.showBreadcrumbs$ = breadcrumbsService.showBreadcrumbs$;
  }


  ngOnInit(): void {
    this.loadData();
    let path = this.location.path();
    this.idComm = path.toString().split('/')[2];
  }
  ngAfterViewChecked(): void {
    let path = this.location.path();
    if (path.toString().split('/')[2] !== this.idComm){
      this.loadData();
      this.idComm = path.toString().split('/')[2];
    }
  }
  loadData(){
    this.communityRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Community>),
      redirectOn4xx(this.router, this.authService)
    );
    this.communityRD$.subscribe(res => {
      // console.log(res)
      if (res && res.payload){
        this.desc = res.payload.firstMetadataValue('dc.description');
        this.titleBanner = res.payload.firstMetadataValue('dc.title');
      }
    });
    this.logoRD$ = this.communityRD$.pipe(
      map((rd: RemoteData<Community>) => rd.payload),
      filter((community: Community) => hasValue(community)),
      mergeMap((community: Community) => community.logo)
    );
    this.communityPageRoute$ = this.communityRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((community) => getCommunityPageRoute(community.id))
    );
    this.isCommunityAdmin$ = this.authorizationDataService.isAuthorized(
      FeatureID.IsCommunityAdmin
    );
    this.isCommunityPage.emit(true);
    this.communityPageService
      .statisticsPublicationsInCommunity()
      .pipe(map((item) => item))
      .subscribe(
        (data) => {
          this.statisticsPublications = data;
          this.loading$.next(false);
        },
        (error) => {
          // Handle error, show an error message, etc.
          console.error('Error fetching data:', error);
          this.loading$.next(false);
        }
      );

    // this.scrollToBottom();
  }
  scrollToBottom(){
    if (this.myScrollContainer && this.myScrollContainer?.nativeElement && typeof window !== undefined) {
      const offsetTopValue = this.myScrollContainer.nativeElement.offsetTop;
  
      window.scrollTo(0 , offsetTopValue);
    }
  }
  getCounterPublicationsByID(id: string) {
    if (this.statisticsPublications && this.statisticsPublications.length > 0) {
      for (const item of this.statisticsPublications) {
        if (item && item.id === id) {
          return item.value;
        }
      }
    }
    return 0; // Return an appropriate default value if the publication with the given name is not found
  }
}
