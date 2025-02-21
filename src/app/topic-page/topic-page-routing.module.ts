import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TopicPageResolver } from './topic-page.resolver';
import { CreateTopicPageComponent } from './create-topic-page/create-topic-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { CreateTopicPageGuard } from './create-topic-page/create-topic-page.guard';
import { DeleteTopicPageComponent } from './delete-topic-page/delete-topic-page.component';
import { TopicBreadcrumbResolver } from '../core/breadcrumbs/topic-breadcrumb.resolver';
import { DSOBreadcrumbsService } from '../core/breadcrumbs/dso-breadcrumbs.service';
import { LinkService } from '../core/cache/builders/link.service';
import { TOPIC_EDIT_PATH, TOPIC_CREATE_PATH } from './topic-page-routing-paths';
import { TopicPageAdministratorGuard } from './topic-page-administrator.guard';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { ThemedTopicPageComponent } from './themed-topic-page.component';
import { MenuItemType } from '../shared/menu/menu-item-type.model';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: TOPIC_CREATE_PATH,
        component: CreateTopicPageComponent,
        canActivate: [AuthenticatedGuard, CreateTopicPageGuard],
      },
      {
        path: ':id',
        resolve: {
          dso: TopicPageResolver,
          breadcrumb: TopicBreadcrumbResolver,
        },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: TOPIC_EDIT_PATH,
            loadChildren: () =>
              import('./edit-topic-page/edit-topic-page.module').then(
                (m) => m.EditTopicPageModule
              ),
            canActivate: [TopicPageAdministratorGuard],
          },
          {
            path: 'delete',
            pathMatch: 'full',
            component: DeleteTopicPageComponent,
            canActivate: [AuthenticatedGuard],
          },
          {
            path: '',
            component: ThemedTopicPageComponent,
            pathMatch: 'full',
          },
        ],
        data: {
          menu: {
            public: [
              {
                id: 'statistics_topic_:id',
                active: true,
                visible: true,
                model: {
                  type: MenuItemType.LINK,
                  text: 'menu.section.statistics',
                  link: 'statistics/topics/:id/',
                } as LinkMenuItemModel,
              },
            ],
          },
        },
      },
    ]),
  ],
  providers: [
    TopicPageResolver,
    TopicBreadcrumbResolver,
    DSOBreadcrumbsService,
    LinkService,
    CreateTopicPageGuard,
    TopicPageAdministratorGuard,
  ],
})
export class TopicPageRoutingModule {}
