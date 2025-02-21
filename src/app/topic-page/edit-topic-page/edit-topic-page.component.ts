import { Component } from '@angular/core';
import { Topic } from '../../core/shared/topic.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EditComColPageComponent } from '../../shared/comcol/comcol-forms/edit-comcol-page/edit-comcol-page.component';
import { getTopicPageRoute } from '../topic-page-routing-paths';

/**
 * Component that represents the page where a user can edit an existing Community
 */
@Component({
  selector: 'ds-edit-topic',
  templateUrl:
    '../../shared/comcol/comcol-forms/edit-comcol-page/edit-comcol-page.component.html',
})
export class EditTopicPageComponent extends EditComColPageComponent<Topic> {
  type = 'topic';

  public constructor(
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(router, route);
  }

  /**
   * Get the topic page url
   * @param topic The topic for which the url is requested
   */
  getPageUrl(topic: Topic): string {
    return getTopicPageRoute(topic.id);
  }
}
