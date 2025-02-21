import { Component } from '@angular/core';
import { ComcolMetadataComponent } from '../../../shared/comcol/comcol-forms/edit-comcol-page/comcol-metadata/comcol-metadata.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Topic } from '../../../core/shared/topic.model';
import { TopicDataService } from '../../../core/data/topic-data.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Component for editing a topic's metadata
 */
@Component({
  selector: 'ds-topic-metadata',
  templateUrl: './topic-metadata.component.html',
})
export class TopicMetadataComponent extends ComcolMetadataComponent<Topic> {
  protected frontendURL = '/topics/';
  protected type = Topic.type;

  public constructor(
    protected topicDataService: TopicDataService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService
  ) {
    super(topicDataService, router, route, notificationsService, translate);
  }
}
