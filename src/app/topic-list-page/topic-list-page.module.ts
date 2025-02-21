import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TopicListPageComponent } from './topic-list-page.component';
import { TopicListPageRoutingModule } from './topic-list-page.routing.module';
import { TopicListComponent } from './topic-list/topic-list.component';
import { ThemedTopicListPageComponent } from './themed-topic-list-page.component';
import { ThemedTopicListComponent } from './topic-list/themed-topic-list.component';
import { TopicListService } from './topic-list-service';

const DECLARATIONS = [
  TopicListPageComponent,
  TopicListComponent,
  ThemedTopicListPageComponent,
  ThemedTopicListComponent,
];
/**
 * The page which houses a title and the Topic list, as described in Topic-list.component
 */
@NgModule({
  imports: [CommonModule, SharedModule, TopicListPageRoutingModule],
  declarations: [...DECLARATIONS],
  exports: [...DECLARATIONS],
  providers: [TopicListService],
})
export class TopicListPageModule {}
