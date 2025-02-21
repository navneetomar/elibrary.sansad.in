import { EditTopicPageComponent } from './edit-topic-page.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TopicMetadataComponent } from './topic-metadata/topic-metadata.component';
import { TopicRolesComponent } from './topic-roles/topic-roles.component';
import { TopicCurateComponent } from './topic-curate/topic-curate.component';
import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { TopicAuthorizationsComponent } from './topic-authorizations/topic-authorizations.component';
import { ResourcePolicyTargetResolver } from '../../shared/resource-policies/resolvers/resource-policy-target.resolver';
import { ResourcePolicyCreateComponent } from '../../shared/resource-policies/create/resource-policy-create.component';
import { ResourcePolicyResolver } from '../../shared/resource-policies/resolvers/resource-policy.resolver';
import { ResourcePolicyEditComponent } from '../../shared/resource-policies/edit/resource-policy-edit.component';
import { TopicAdministratorGuard } from '../../core/data/feature-authorization/feature-authorization-guard/topic-administrator.guard';

/**
 * Routing module that handles the routing for the Edit Topic page administrator functionality
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
        },
        data: { breadcrumbKey: 'topic.edit' },
        component: EditTopicPageComponent,
        canActivate: [TopicAdministratorGuard],
        children: [
          {
            path: '',
            redirectTo: 'metadata',
            pathMatch: 'full',
          },
          {
            path: 'metadata',
            component: TopicMetadataComponent,
            data: {
              title: 'topic.edit.tabs.metadata.title',
              hideReturnButton: true,
              showBreadcrumbs: true,
            },
          },
          {
            path: 'roles',
            component: TopicRolesComponent,
            data: {
              title: 'topic.edit.tabs.roles.title',
              showBreadcrumbs: true,
            },
          },
          {
            path: 'curate',
            component: TopicCurateComponent,
            data: {
              title: 'topic.edit.tabs.curate.title',
              showBreadcrumbs: true,
            },
          },
          /*{
            path: 'authorizations',
            component: CommunityAuthorizationsComponent,
            data: { title: 'topic.edit.tabs.authorizations.title', showBreadcrumbs: true }
          },*/
          {
            path: 'authorizations',
            data: { showBreadcrumbs: true },
            children: [
              {
                path: 'create',
                resolve: {
                  resourcePolicyTarget: ResourcePolicyTargetResolver,
                },
                component: ResourcePolicyCreateComponent,
                data: { title: 'resource-policies.create.page.title' },
              },
              {
                path: 'edit',
                resolve: {
                  resourcePolicy: ResourcePolicyResolver,
                },
                component: ResourcePolicyEditComponent,
                data: { title: 'resource-policies.edit.page.title' },
              },
              {
                path: '',
                component: TopicAuthorizationsComponent,
                data: {
                  title: 'topic.edit.tabs.authorizations.title',
                  showBreadcrumbs: true,
                  hideReturnButton: true,
                },
              },
            ],
          },
        ],
      },
    ]),
  ],
  providers: [ResourcePolicyResolver, ResourcePolicyTargetResolver],
})
export class EditTopicPageRoutingModule {}
