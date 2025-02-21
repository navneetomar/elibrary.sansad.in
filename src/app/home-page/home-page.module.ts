import { ViewItemListService } from './view-item-list/view-item-list.service';
import { ViewItemListComponent } from './view-item-list/view-item-list.component';
import { DownloadItemListComponent } from './download-item-list/download-item-list.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HomeNewsComponent } from './home-news/home-news.component';
import { HomeStaticsComponent } from './home-statics/home-statics.component';
import { HomeAuthorsComponent } from './home-authors/home-authors.component';
import { HomePageRoutingModule } from './home-page-routing.module';

import { HomePageComponent } from './home-page.component';
import { TopLevelCommunityListComponent } from './top-level-community-list/top-level-community-list.component';
import { StatisticsModule } from '../statistics/statistics.module';
import { ThemedHomeNewsComponent } from './home-news/themed-home-news.component';

import { ThemedHomePageComponent } from './themed-home-page.component';
import { RecentItemListComponent } from './recent-item-list/recent-item-list.component';
import { JournalEntitiesModule } from '../entity-groups/journal-entities/journal-entities.module';
import { ResearchEntitiesModule } from '../entity-groups/research-entities/research-entities.module';
import { DownloadItemListService } from './download-item-list/download-item-list.service';
import { ItemGroupPipe } from './view-item-list/view-item-list.pine';
import { UltiService } from '../core/services/ulti.service';
import {CarouselModule} from 'primeng/carousel';
import {DropdownModule} from 'primeng/dropdown';
import { HomeSubPageComponent } from './home-sub-page/home-sub-page.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
const DECLARATIONS = [
  HomePageComponent,
  HomeSubPageComponent,
  ThemedHomePageComponent,
  TopLevelCommunityListComponent,
  ThemedHomeNewsComponent,
  HomeNewsComponent,
  HomeStaticsComponent,
  HomeAuthorsComponent,
  RecentItemListComponent,
  DownloadItemListComponent,
  ViewItemListComponent,
  ItemGroupPipe,
  
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    SharedModule.withEntryComponents(),
    JournalEntitiesModule.withEntryComponents(),
    ResearchEntitiesModule.withEntryComponents(),
    HomePageRoutingModule,
    StatisticsModule.forRoot(),
    CarouselModule,
    DropdownModule,
    DynamicDialogModule,
    DialogModule
  ],
  declarations: [...DECLARATIONS],
  exports: [...DECLARATIONS],
  bootstrap: [HomePageComponent],
  providers: [DownloadItemListService, ViewItemListService, UltiService, DialogService],
})
export class HomePageModule {}
