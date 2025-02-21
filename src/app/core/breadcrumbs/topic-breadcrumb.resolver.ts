import { Injectable } from '@angular/core';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';
import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';
import { TopicDataService } from '../data/topic-data.service';
import { Topic } from '../shared/topic.model';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { TOPIC_PAGE_LINKS_TO_FOLLOW } from '../../topic-page/topic-page.resolver';

/**
 * The class that resolves the BreadcrumbConfig object for aTopic
 */
@Injectable({
  providedIn: 'root',
})
export class TopicBreadcrumbResolver extends DSOBreadcrumbResolver<Topic> {
  constructor(
    protected breadcrumbService: DSOBreadcrumbsService,
    protected dataService: TopicDataService
  ) {
    super(breadcrumbService, dataService);
  }

  /**
   * Method that returns the follow links to already resolve
   * The self links defined in this list are expected to be requested somewhere in the near future
   * Requesting them as embeds will limit the number of requests
   */
  get followLinks(): FollowLinkConfig<Topic>[] {
    return TOPIC_PAGE_LINKS_TO_FOLLOW;
  }
}
