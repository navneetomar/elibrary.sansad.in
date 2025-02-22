import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { CollectionPageComponent } from './collection-page.component';
import { CollectionPageRoutingModule } from './collection-page-routing.module';
import { CreateCollectionPageComponent } from './create-collection-page/create-collection-page.component';
import { DeleteCollectionPageComponent } from './delete-collection-page/delete-collection-page.component';
import { EditItemTemplatePageComponent } from './edit-item-template-page/edit-item-template-page.component';
import { ThemedEditItemTemplatePageComponent } from './edit-item-template-page/themed-edit-item-template-page.component';
import { EditItemPageModule } from '../item-page/edit-item-page/edit-item-page.module';
import { CollectionItemMapperComponent } from './collection-item-mapper/collection-item-mapper.component';
import { SearchService } from '../core/shared/search/search.service';
import { StatisticsModule } from '../statistics/statistics.module';
import { CollectionFormModule } from './collection-form/collection-form.module';
import { ThemedCollectionPageComponent } from './themed-collection-page.component';
import { ComcolModule } from '../shared/comcol/comcol.module';
import { UltiService } from '../core/services/ulti.service';
import { CollectionFilterComponent } from './collection-filter/collection-filter.component';
import { CollectionFilterService } from './collection-filter/collection-filter.service';
import { SearchFilterService } from '../core/shared/search/search-filter.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CollectionPageRoutingModule,
    StatisticsModule.forRoot(),
    EditItemPageModule,
    CollectionFormModule,
    ComcolModule,
    NgbAccordionModule,
    FormsModule,
    NouisliderModule
  ],
  declarations: [
    CollectionPageComponent,
    ThemedCollectionPageComponent,
    CreateCollectionPageComponent,
    DeleteCollectionPageComponent,
    EditItemTemplatePageComponent,
    ThemedEditItemTemplatePageComponent,
    CollectionItemMapperComponent,
    CollectionFilterComponent,
  ],
  providers: [
    SearchService,
    UltiService,
    CollectionFilterService,
    SearchFilterService,
  ]
})
export class CollectionPageModule {

}
