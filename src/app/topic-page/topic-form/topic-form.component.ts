import { Component, Input, Output } from '@angular/core';
import {
  DynamicFormControlModel,
  DynamicFormService,
  DynamicInputModel,
  DynamicTextAreaModel,
} from '@ng-dynamic-forms/core';
import { Topic } from '../../core/shared/topic.model';
import { ComColFormComponent } from '../../shared/comcol/comcol-forms/comcol-form/comcol-form.component';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TopicDataService } from '../../core/data/topic-data.service';
import { AuthService } from '../../core/auth/auth.service';
import { RequestService } from '../../core/data/request.service';
import { ObjectCacheService } from '../../core/cache/object-cache.service';

/**
 * Form used for creating and editing communities
 */
@Component({
  selector: 'ds-topic-form',
  styleUrls: [
    '../../shared/comcol/comcol-forms/comcol-form/comcol-form.component.scss',
  ],
  templateUrl:
    '../../shared/comcol/comcol-forms/comcol-form/comcol-form.component.html',
})
export class TopicFormComponent extends ComColFormComponent<Topic> {
  /**
   * @type {Topic} A new Topic when a Topic is being created, an existing Input Topic when a Topic is being edited
   */
  @Input() dso: Topic = new Topic();
  @Output() isTopic = true;
  /**
   * @type {Topic.type} This is a Topic-type form
   */
  type = Topic.type;

  /**
   * The dynamic form fields used for creating/editing a community
   * @type {(DynamicInputModel | DynamicTextAreaModel)[]}
   */
  formModel: DynamicFormControlModel[] = [
    new DynamicInputModel({
      id: 'title',
      name: 'dc.title',
      required: true,
      validators: {
        required: null,
      },
      errorMessages: {
        required: 'Please enter a name for this title',
      },
    }),
    new DynamicTextAreaModel({
      id: 'description',
      name: 'dc.description',
      hidden: true,
    }),
    new DynamicTextAreaModel({
      id: 'abstract',
      name: 'dc.description.abstract',
    }),
    new DynamicTextAreaModel({
      id: 'rights',
      name: 'dc.rights',
      hidden: true,
    }),
    new DynamicTextAreaModel({
      id: 'tableofcontents',
      name: 'dc.description.tableofcontents',
      hidden: true,
    }),
  ];

  public constructor(
    protected formService: DynamicFormService,
    protected translate: TranslateService,
    protected notificationsService: NotificationsService,
    protected authService: AuthService,
    protected dsoService: TopicDataService,
    protected requestService: RequestService,
    protected objectCache: ObjectCacheService
  ) {
    super(
      formService,
      translate,
      notificationsService,
      authService,
      requestService,
      objectCache
    );
  }
}
