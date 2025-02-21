import { Component, Inject } from '@angular/core';
import { focusShadow } from '../../../../animations/focus';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import {
  listableObjectComponent
} from '../../../../object-collection/shared/listable-object/listable-object.decorator';
import { SearchResultTableElementComponent } from '../../search-result-table-element.component';
import { Item } from '../../../../../core/shared/item.model';
import { ItemSearchResult } from '../../../../object-collection/shared/item-search-result.model';
import { getItemPageRoute } from '../../../../../item-page/item-page-routing-paths';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { BitstreamDataService } from '../../../../../core/data/bitstream-data.service';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
import { Location } from '@angular/common';

@listableObjectComponent('PublicationSearchResult', ViewMode.TableElement)
@listableObjectComponent(ItemSearchResult, ViewMode.TableElement)
@Component({
  selector: 'ds-item-search-result-table-element',
  styleUrls: ['./item-search-result-table-element.component.scss'],
  templateUrl: './item-search-result-table-element.component.html',
  animations: [focusShadow]
})
/**
 * The component for displaying a table element for an item search result of the type Publication
 */
export class ItemSearchResultTableElementComponent extends SearchResultTableElementComponent<ItemSearchResult, Item> {
  /**
   * Route to the item's page
   */
  itemPageRoute: string;

  dsoTitle: string;

  status = false;
  isShowStatus = false;

  constructor(
    protected truncatableService: TruncatableService,
    protected bitstreamDataService: BitstreamDataService,
    protected dsoNameService: DSONameService,
    protected location: Location,
    @Inject(APP_CONFIG) protected appConfig?: AppConfig
  ) {
    super(truncatableService, bitstreamDataService,dsoNameService,appConfig);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.itemPageRoute = getItemPageRoute(this.dso);
    this.dsoTitle = this.dsoNameService.getName(this.dso);
    
    this.status = this.dso.isArchived;
    if (this.location && this.location.path().includes('/mydspace?configuration')){
      this.isShowStatus = true;
    }
  }
}
