import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EditTopicPageRoutingModule } from './edit-topic-page.routing.module';
import { EditTopicPageComponent } from './edit-topic-page.component';
import { TopicCurateComponent } from './topic-curate/topic-curate.component';
import { TopicMetadataComponent } from './topic-metadata/topic-metadata.component';
import { TopicRolesComponent } from './topic-roles/topic-roles.component';
import { TopicAuthorizationsComponent } from './topic-authorizations/topic-authorizations.component';
import { TopicFormModule } from '../topic-form/topic-form.module';
import { ResourcePoliciesModule } from '../../shared/resource-policies/resource-policies.module';
import { ComcolModule } from '../../shared/comcol/comcol.module';

/**
 * Module that contains all components related to the Edit Community page administrator functionality
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EditTopicPageRoutingModule,
    TopicFormModule,
    ComcolModule,
    ResourcePoliciesModule,
  ],
  declarations: [
    EditTopicPageComponent,
    TopicCurateComponent,
    TopicMetadataComponent,
    TopicRolesComponent,
    TopicAuthorizationsComponent,
  ],
})
export class EditTopicPageModule {}
