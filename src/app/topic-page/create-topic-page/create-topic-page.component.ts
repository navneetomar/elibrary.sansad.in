import { Component } from '@angular/core';
import { Topic } from '../../core/shared/topic.model';
import { TopicDataService } from '../../core/data/topic-data.service';
import { RouteService } from '../../core/services/route.service';
import { Router } from '@angular/router';
import { CreateComColPageComponent } from '../../shared/comcol/comcol-forms/create-comcol-page/create-comcol-page.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { RequestService } from '../../core/data/request.service';

/**
 * Component that represents the page where a user can create a new Topic
 */
@Component({
  selector: 'ds-create-topic',
  styleUrls: ['./create-topic-page.component.scss'],
  templateUrl: './create-topic-page.component.html',
})
export class CreateTopicPageComponent extends CreateComColPageComponent<Topic> {
  protected frontendURL = '/topics/';
  protected type = Topic.type;

  public constructor(
    protected topicDataService: TopicDataService,
    protected routeService: RouteService,
    protected router: Router,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected requestService: RequestService
  ) {
    super(
      topicDataService,
      null,
      topicDataService,
      routeService,
      router,
      notificationsService,
      translate,
      requestService
    );
  }
}
