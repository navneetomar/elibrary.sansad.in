import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { TopicPageComponent } from './topic-page.component';

import { TopicPageRoutingModule } from './topic-page-routing.module';
import { TopicPageSubTopicListComponent } from './sub-topic-list/topic-page-sub-topic-list.component';
import { CreateTopicPageComponent } from './create-topic-page/create-topic-page.component';
import { DeleteTopicPageComponent } from './delete-topic-page/delete-topic-page.component';
import { StatisticsModule } from '../statistics/statistics.module';
import { TopicFormModule } from './topic-form/topic-form.module';
import { ThemedTopicPageComponent } from './themed-topic-page.component';
import { ComcolModule } from '../shared/comcol/comcol.module';
import { ThemedTopicPageSubTopicListComponent } from './sub-topic-list/themed-topic-page-sub-topic-list.component';
const DECLARATIONS = [
  TopicPageComponent,
  ThemedTopicPageComponent,
  ThemedTopicPageSubTopicListComponent,

  TopicPageSubTopicListComponent,
  CreateTopicPageComponent,
  DeleteTopicPageComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TopicPageRoutingModule,
    StatisticsModule.forRoot(),
    TopicFormModule,
    ComcolModule,
  ],
  declarations: [...DECLARATIONS],
  exports: [...DECLARATIONS],
})
export class TopicPageModule {}
