import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { hasNoValue, hasValue } from '../../shared/empty.util';
import { TopicDataService } from '../../core/data/topic-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Topic } from '../../core/shared/topic.model';
import { map, tap } from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';

/**
 * Prevent creation of a topic with an invalid parent topic provided
 * @class CreateCommunityPageGuard
 */
@Injectable()
export class CreateTopicPageGuard implements CanActivate {
  public constructor(
    private router: Router,
    private topicService: TopicDataService
  ) {}

  /**
   * True when either NO parent ID query parameter has been provided, or the parent ID resolves to a valid parent topic
   * Reroutes to a 404 page when the page cannot be activated
   * @method canActivate
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const parentID = route.queryParams.parent;
    if (hasNoValue(parentID)) {
      return observableOf(true);
    }

    return this.topicService.findById(parentID).pipe(
      getFirstCompletedRemoteData(),
      map(
        (topicRD: RemoteData<Topic>) =>
          hasValue(topicRD) && topicRD.hasSucceeded && hasValue(topicRD.payload)
      ),
      tap((isValid: boolean) => {
        if (!isValid) {
          this.router.navigate(['/404']);
        }
      })
    );
  }
}
