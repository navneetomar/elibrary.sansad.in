import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MetadataImportPageComponent } from './admin-import-metadata-page/metadata-import-page.component';
import { AdminSearchPageComponent } from './admin-search-page/admin-search-page.component';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { AdminWorkflowPageComponent } from './admin-workflow-page/admin-workflow-page.component';
import { I18nBreadcrumbsService } from '../core/breadcrumbs/i18n-breadcrumbs.service';
import { AdminCurationTasksComponent } from './admin-curation-tasks/admin-curation-tasks.component';
import { AdminPoliciesComponent } from './admin-policies/admin-policies.component';
import { REGISTRIES_MODULE_PATH } from './admin-routing-paths';
import { BatchImportPageComponent } from './admin-import-batch-page/batch-import-page.component';
import { AdminStatisticsComponent } from './admin-statistics/admin-statistics.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: REGISTRIES_MODULE_PATH,
        loadChildren: () =>
          import('./admin-registries/admin-registries.module').then(
            (m) => m.AdminRegistriesModule
          ),
      },
      {
        path: 'search',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        component: AdminSearchPageComponent,
        data: { title: 'admin.search.title', breadcrumbKey: 'admin.search' },
      },
      {
        path: 'workflow',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        component: AdminWorkflowPageComponent,
        data: {
          title: 'admin.workflow.title',
          breadcrumbKey: 'admin.workflow',
        },
      },
      {
        path: 'curation-tasks',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        component: AdminCurationTasksComponent,
        data: {
          title: 'admin.curation-tasks.title',
          breadcrumbKey: 'admin.curation-tasks',
        },
      },
      {
        path: 'policies',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        component: AdminPoliciesComponent,
        data: {
          title: 'admin.policies.title',
          breadcrumbKey: 'policies',
        },
      },
      {
        path: 'statistics',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        component: AdminStatisticsComponent,
        data: {
          title: 'admin.statistics_admin.title',
          breadcrumbKey: 'statistics_admin',
        },
      },
      {
        path: 'metadata-import',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        component: MetadataImportPageComponent,
        data: {
          title: 'admin.metadata-import.title',
          breadcrumbKey: 'admin.metadata-import',
        },
      },
      {
        path: 'batch-import',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        component: BatchImportPageComponent,
        data: {
          title: 'admin.batch-import.title',
          breadcrumbKey: 'admin.batch-import',
        },
      },
    ]),
  ],
  providers: [I18nBreadcrumbResolver, I18nBreadcrumbsService],
})
export class AdminRoutingModule {}
