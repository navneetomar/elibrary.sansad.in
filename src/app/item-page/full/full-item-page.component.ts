import { filter, map } from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

import { ItemPageComponent } from '../simple/item-page.component';
import { MetadataMap } from '../../core/shared/metadata.models';
import { ItemDataService } from '../../core/data/item-data.service';

import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';

import { fadeInOut } from '../../shared/animations/fade';
import { hasValue } from '../../shared/empty.util';
import { AuthService } from '../../core/auth/auth.service';
import { Location } from '@angular/common';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { BreadcrumbsService } from 'src/app/breadcrumbs/breadcrumbs.service';
import { Breadcrumb } from 'src/app/breadcrumbs/breadcrumb/breadcrumb.model';
import { TranslateService } from '@ngx-translate/core';

/**
 * This component renders a full item page.
 * The route parameter 'id' is used to request the item it represents.
 */

@Component({
  selector: 'ds-full-item-page',
  styleUrls: ['./full-item-page.component.scss'],
  templateUrl: './full-item-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut],
})
export class FullItemPageComponent
  extends ItemPageComponent
  implements OnInit, OnDestroy
{
  itemRD$: BehaviorSubject<RemoteData<Item>>;

  metadata$: Observable<MetadataMap>;

  /**
   * True when the itemRD has been originated from its workspaceite/workflowitem, false otherwise.
   */
  fromSubmissionObject = false;

  subs = [];
  breadcrumbs$: Observable<Breadcrumb[]>;
  showBreadcrumbs$: Observable<boolean>;
  constructor(
    protected route: ActivatedRoute,
    router: Router,
    items: ItemDataService,
    authService: AuthService,
    authorizationService: AuthorizationDataService,
    breadcrumbsService: BreadcrumbsService,
    private _location: Location,
    private translate: TranslateService
  ) {
    super(
      route,
      router,
      items,
      authService,
      authorizationService,
      breadcrumbsService
    );
    this.breadcrumbs$ = breadcrumbsService.breadcrumbs$;
    this.showBreadcrumbs$ = breadcrumbsService.showBreadcrumbs$;
  }

  getMetadataLabel(field: string): string {
    let label = field; // Default to field name if no translation is found
    this.translate.get(field).subscribe((translated: string) => {
      label = translated;
    });
    return label;
  }
  
  

  /*** AoT inheritance fix, will hopefully be resolved in the near future **/
  ngOnInit(): void {
    super.ngOnInit();
    this.metadata$ = this.itemRD$.pipe(
      map((rd: RemoteData<Item>) => rd.payload),
      filter((item: Item) => hasValue(item)),
      map((item: Item) => item.metadata)
    );

    this.subs.push(
      this.route.data.subscribe((data: Data) => {
        this.fromSubmissionObject = hasValue(data.wfi) || hasValue(data.wsi);
      })
    );
  }

  /**
   * Navigate back in browser history.
   */
  back() {
    this._location.back();
  }

  ngOnDestroy() {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }
}
