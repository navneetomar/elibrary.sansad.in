import { Component, Input } from '@angular/core';
import { Community } from '../../../../core/shared/community.model';
import { SearchResultTableElementComponent } from '../search-result-table-element.component';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { hasNoValue, hasValue } from '../../../empty.util';
import { followLink } from '../../../utils/follow-link-config.model';
import { DSONameService } from 'src/app/core/breadcrumbs/dso-name.service';

@Component({
  selector: 'ds-community-search-result-table-element',
  styleUrls: [
    '../search-result-table-element.component.scss',
    'community-search-result-table-element.component.scss',
  ],
  templateUrl: 'community-search-result-table-element.component.html',
})
/**
 * Component representing a table element for a community search result
 */
@listableObjectComponent(CommunitySearchResult, ViewMode.TableElement)
export class CommunitySearchResultTableElementComponent extends SearchResultTableElementComponent<CommunitySearchResult,Community> {
  private _dso: Community;

  constructor(
    private linkService: LinkService,
    protected truncatableService: TruncatableService,
    protected bitstreamDataService: BitstreamDataService,
    protected dsoNameService: DSONameService,
  ) {
    super(truncatableService, bitstreamDataService,dsoNameService);
  }

  // @ts-ignore
  @Input() set dso(dso: Community) {
    this._dso = dso;
    if (hasValue(this._dso) && hasNoValue(this._dso.logo)) {
      this.linkService.resolveLink<Community>(this._dso, followLink('logo'));
    }
  }

  get dso(): Community {
    return this._dso;
  }
}
