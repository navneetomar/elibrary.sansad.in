import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { RemoteData } from '../core/data/remote-data';
import { Topic } from '../core/shared/topic.model';
import { TopicDataService } from '../core/data/topic-data.service';
import {
  followLink,
  FollowLinkConfig,
} from '../shared/utils/follow-link-config.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { ResolvedAction } from '../core/resolving/resolver.actions';
import { Store } from '@ngrx/store';

/**
 * The self links defined in this list are expected to be requested somewhere in the near future
 * Requesting them as embeds will limit the number of requests
 */
export const TOPIC_PAGE_LINKS_TO_FOLLOW: FollowLinkConfig<Topic>[] = [
  followLink('logo'),
  followLink('subtopics'),
  followLink('mainTopic'),
];

/**
 * This class represents a resolver that requests a specific community before the route is activated
 */
@Injectable()
export class TopicPageResolver implements Resolve<RemoteData<Topic>> {
  constructor(
    private topicService: TopicDataService,
    private store: Store<any>
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<RemoteData<Topic>> {
    const topicRD$ = this.topicService
      .findById(route.params.id, true, false, ...TOPIC_PAGE_LINKS_TO_FOLLOW)
      .pipe(getFirstCompletedRemoteData());

    topicRD$.subscribe((topicRD: RemoteData<Topic>) => {
      this.store.dispatch(new ResolvedAction(state.url, topicRD.payload));
    });

    return topicRD$;
  }
}
