import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AccessControlModule } from '../access-control/access-control.module';
import { MetadataImportPageComponent } from './admin-import-metadata-page/metadata-import-page.component';
import { AdminRegistriesModule } from './admin-registries/admin-registries.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminCurationTasksComponent } from './admin-curation-tasks/admin-curation-tasks.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { FormsModule } from '@angular/forms';
import { TreeDropDragComponent } from './admin-policies/tree-drop-drag/tree-drop-drag.component';
import {
  NgbDatepickerModule,
  NgbNavModule,
  NgbAccordionModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentPoliciesComponent } from './admin-policies/content-policies/content-policies.component';
import { TablePoliciesComponent } from './admin-policies/table-policies/table-policies.component';
import { DetailPoliciesComponent } from './admin-policies/detail-policies/detail-policies.component';
import { AdminWorkflowModuleModule } from './admin-workflow-page/admin-workflow.module';
import { AdminSearchModule } from './admin-search-page/admin-search.module';
import { AdminSidebarSectionComponent } from './admin-sidebar/admin-sidebar-section/admin-sidebar-section.component';
import { ExpandableAdminSidebarSectionComponent } from './admin-sidebar/expandable-admin-sidebar-section/expandable-admin-sidebar-section.component';
import { BatchImportPageComponent } from './admin-import-batch-page/batch-import-page.component';
import { AdminPoliciesComponent } from './admin-policies/admin-policies.component';
import { ResourcePoliciesModule } from '../shared/resource-policies/resource-policies.module';
import { AdminStatisticsComponent } from './admin-statistics/admin-statistics.component';
import { AdminStatisticsRankingComponent } from './admin-statistics/admin-statistics-ranking/admin-statistics-ranking.component';
import { UltiService } from '../core/services/ulti.service';
const ENTRY_COMPONENTS = [
  // put only entry components that use custom decorator
  AdminSidebarSectionComponent,
  ExpandableAdminSidebarSectionComponent,
];

@NgModule({
  imports: [
    DragDropModule,
    FormsModule,
    AdminRoutingModule,
    NgbNavModule,
    NgbDatepickerModule,
    NgbAccordionModule,

    NgbModule,
    ResourcePoliciesModule,
    AdminRegistriesModule,
    AccessControlModule,
    AdminSearchModule.withEntryComponents(),
    AdminWorkflowModuleModule.withEntryComponents(),
    SharedModule,
  ],
  declarations: [
    AdminCurationTasksComponent,
    AdminStatisticsComponent,
    AdminStatisticsRankingComponent,
    TreeDropDragComponent,
    ContentPoliciesComponent,
    TablePoliciesComponent,
    DetailPoliciesComponent,
    AdminPoliciesComponent,
    MetadataImportPageComponent,
    BatchImportPageComponent,
  ],
  providers: [
    UltiService,
  ]
})
export class AdminModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during SSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: AdminModule,
      providers: ENTRY_COMPONENTS.map((component) => ({ provide: component })),
    };
  }
}
