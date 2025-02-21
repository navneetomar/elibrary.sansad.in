import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CdkTreeModule } from '@angular/cdk/tree';

import { TopicListService } from './topic-list-service';
import { ThemedTopicListPageComponent } from './themed-topic-list-page.component';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';

/**
 * RouterModule to help navigate to the page with the Topic list tree
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ThemedTopicListPageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
        },
        data: {
          title: 'topicList.tabTitle',
          breadcrumbKey: 'topicList',
        },
      },
    ]),
    CdkTreeModule,
  ],
  providers: [TopicListService],
})
export class TopicListPageRoutingModule {}
