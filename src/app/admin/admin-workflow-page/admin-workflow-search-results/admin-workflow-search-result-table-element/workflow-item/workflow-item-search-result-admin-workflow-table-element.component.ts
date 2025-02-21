import { Component, Inject, OnInit } from '@angular/core';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../../core/shared/context.model';
import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { Observable } from 'rxjs';
import { LinkService } from '../../../../../core/cache/builders/link.service';
import { followLink } from '../../../../../shared/utils/follow-link-config.model';
import { RemoteData } from '../../../../../core/data/remote-data';
import { getAllSucceededRemoteData, getRemoteDataPayload } from '../../../../../core/shared/operators';
import { Item } from '../../../../../core/shared/item.model';

import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { WorkflowItemSearchResult } from '../../../../../shared/object-collection/shared/workflow-item-search-result.model';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { APP_CONFIG, AppConfig } from '../../../../../../config/app-config.interface';
import { SearchResultTableElementComponent } from 'src/app/shared/object-table/search-result-table-element/search-result-table-element.component';
import { BitstreamDataService } from 'src/app/core/data/bitstream-data.service';

@listableObjectComponent(WorkflowItemSearchResult, ViewMode.TableElement, Context.AdminWorkflowSearch)
@Component({
  selector: 'ds-workflow-item-search-result-admin-workflow-table-element',
  styleUrls: ['./workflow-item-search-result-admin-workflow-table-element.component.scss'],
  templateUrl: './workflow-item-search-result-admin-workflow-table-element.component.html'
})
/**
 * The component for displaying a list element for an workflow item on the admin workflow search page
 */
export class WorkflowItemSearchResultAdminWorkflowTableElementComponent extends SearchResultTableElementComponent<WorkflowItemSearchResult, WorkflowItem> implements OnInit {

  /**
   * The item linked to the workflow item
   */
  public item$: Observable<Item>;

  constructor(private linkService: LinkService,
              protected truncatableService: TruncatableService,
              protected bitstreamDataService: BitstreamDataService,
              protected dsoNameService: DSONameService,
              @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {
    super(truncatableService,bitstreamDataService, dsoNameService, appConfig);
  }

  /**
   * Initialize the item object from the workflow item
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.dso = this.linkService.resolveLink(this.dso, followLink('item'));
    this.item$ = (this.dso.item as Observable<RemoteData<Item>>).pipe(getAllSucceededRemoteData(), getRemoteDataPayload());
  }
}
