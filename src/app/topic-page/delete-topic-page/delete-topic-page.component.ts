import { Component } from '@angular/core';
import { Topic } from '../../core/shared/topic.model';
import { TopicDataService } from '../../core/data/topic-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteComColPageComponent } from '../../shared/comcol/comcol-forms/delete-comcol-page/delete-comcol-page.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Component that represents the page where a user can delete an existing Topic
 */
@Component({
  selector: 'ds-delete-topic',
  styleUrls: ['./delete-topic-page.component.scss'],
  templateUrl: './delete-topic-page.component.html',
})
export class DeleteTopicPageComponent extends DeleteComColPageComponent<Topic> {
  protected frontendURL = '/topics/';

  public constructor(
    protected dsoDataService: TopicDataService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected notifications: NotificationsService,
    protected translate: TranslateService
  ) {
    super(dsoDataService, router, route, notifications, translate);
  }
}
