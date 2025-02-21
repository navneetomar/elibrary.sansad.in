import { mergeMap, filter, map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { TopicDataService } from '../core/data/topic-data.service';
import { RemoteData } from '../core/data/remote-data';
import { Bitstream } from '../core/shared/bitstream.model';

import { Topic } from '../core/shared/topic.model';

import { MetadataService } from '../core/metadata/metadata.service';

import { fadeInOut } from '../shared/animations/fade';
import { hasValue } from '../shared/empty.util';
import { getAllSucceededRemoteDataPayload } from '../core/shared/operators';
import { AuthService } from '../core/auth/auth.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { getTopicPageRoute } from './topic-page-routing-paths';
import { redirectOn4xx } from '../core/shared/authorized.operators';
import { Breadcrumb } from '../breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsService } from '../breadcrumbs/breadcrumbs.service';

@Component({
  selector: 'ds-topic-page',
  styleUrls: ['./topic-page.component.scss'],
  templateUrl: './topic-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut],
})
/**
 * This component represents a detail page for a single topic
 */
export class TopicPageComponent implements OnInit {
  /**
   * The topic displayed on this page
   */
  topicRD$: Observable<RemoteData<Topic>>;

  /**
   * Whether the current user is a Topic admin
   */
  isTopicAdmin$: Observable<boolean>;

  /**
   * The logo of this topic
   */
  logoRD$: Observable<RemoteData<Bitstream>>;

  /**
   * Route to the topic page
   */
  topicPageRoute$: Observable<string>;
  breadcrumbs$: Observable<Breadcrumb[]>;
  showBreadcrumbs$: Observable<boolean>;
  constructor(
    private topicDataService: TopicDataService,
    private metadata: MetadataService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private authorizationDataService: AuthorizationDataService,
    private breadcrumbsService: BreadcrumbsService
  ) {
    this.breadcrumbs$ = breadcrumbsService.breadcrumbs$;
    this.showBreadcrumbs$ = breadcrumbsService.showBreadcrumbs$;
  }

  ngOnInit(): void {
    this.topicRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Topic>),
      redirectOn4xx(this.router, this.authService)
    );
    this.logoRD$ = this.topicRD$.pipe(
      map((rd: RemoteData<Topic>) => rd.payload),
      filter((topic: Topic) => hasValue(topic)),
      mergeMap((topic: Topic) => topic.logo)
    );
    this.topicPageRoute$ = this.topicRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((topic) => getTopicPageRoute(topic.id))
    );
    this.isTopicAdmin$ = this.authorizationDataService.isAuthorized(
      FeatureID.IsTopicAdmin
    );
  }
}
