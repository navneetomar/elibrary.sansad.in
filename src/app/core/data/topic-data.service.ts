import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { Topic } from '../shared/topic.model';
import { TOPIC } from '../shared/topic.resource-type';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ComColDataService } from './comcol-data.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';
import { BitstreamDataService } from './bitstream-data.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { isNotEmpty } from '../../shared/empty.util';
import { FindListOptions } from './find-list-options.model';
import { dataService } from './base/data-service.decorator';

@Injectable()
@dataService(TOPIC)
export class TopicDataService extends ComColDataService<Topic> {
  protected topLinkPath = 'search/top';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected comparator: DSOChangeAnalyzer<Topic>,
    protected notificationsService: NotificationsService,
    protected bitstreamDataService: BitstreamDataService
  ) {
    super(
      'topics',
      requestService,
      rdbService,
      objectCache,
      halService,
      comparator,
      notificationsService,
      bitstreamDataService
    );
  }

  // this method is overridden in order to make it public
  getEndpoint() {
    return this.halService.getEndpoint(this.linkPath);
  }

  findTop(
    options: FindListOptions = {},
    ...linksToFollow: FollowLinkConfig<Topic>[]
  ): Observable<RemoteData<PaginatedList<Topic>>> {
    return this.getEndpoint().pipe(
      map((href) => `${href}/search/top`),
      switchMap((href) =>
        this.findListByHref(href, options, true, true, ...linksToFollow)
      )
    );
  }

  protected getFindByParentHref(parentUUID: string): Observable<string> {
    return this.halService
      .getEndpoint(this.linkPath)
      .pipe(
        switchMap((topicEndpointHref: string) =>
          this.halService.getEndpoint(
            'subtopics',
            `${topicEndpointHref}/${parentUUID}`
          )
        )
      );
  }

  protected getScopeCommunityHref(options: FindListOptions) {
    return this.getEndpoint().pipe(
      map((endpoint: string) => this.getIDHref(endpoint, options.scopeID)),
      filter((href: string) => isNotEmpty(href)),
      take(1)
    );
  }
}
