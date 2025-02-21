import { Component, Inject, Input } from '@angular/core';
import { SearchResultTableElementComponent } from '../search-result-table-element.component';
import { Collection } from '../../../../core/shared/collection.model';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { hasNoValue, hasValue } from '../../../empty.util';
import { followLink } from '../../../utils/follow-link-config.model';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
import { DSONameService } from 'src/app/core/breadcrumbs/dso-name.service';

@Component({
  selector: 'ds-collection-search-result-table-element',
  styleUrls: ['../search-result-table-element.component.scss', 'collection-search-result-table-element.component.scss'],
  templateUrl: 'collection-search-result-table-element.component.html'
})
/**
 * Component representing a table element for a collection search result
 */
@listableObjectComponent(CollectionSearchResult, ViewMode.TableElement)
export class CollectionSearchResultTableElementComponent extends SearchResultTableElementComponent< CollectionSearchResult, Collection > {
  private _dso: Collection;

  constructor(
    private linkService: LinkService,
    protected truncatableService: TruncatableService,
    protected bitstreamDataService: BitstreamDataService,
    protected dsoNameService: DSONameService,
    @Inject(APP_CONFIG) protected appConfig?: AppConfig,
  ) {
    super(truncatableService, bitstreamDataService,dsoNameService);
  }

  // @ts-ignore
  @Input() set dso(dso: Collection) {
    this._dso = dso;
    if (hasValue(this._dso) && hasNoValue(this._dso.logo)) {
      this.linkService.resolveLink<Collection>(
        this._dso,
        followLink('logo')
      );
    }
    // console.log(this.dso)
  }

  get dso(): Collection {
    return this._dso;
  }
}
