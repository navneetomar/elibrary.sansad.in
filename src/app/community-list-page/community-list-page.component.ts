import { Component } from '@angular/core';
import { Breadcrumb } from '../breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsService } from '../breadcrumbs/breadcrumbs.service';
import { Observable } from 'rxjs';
/**
 * Page with title and the community list tree, as described in community-list.component;
 * navigated to with community-list.page.routing.module
 */
@Component({
  selector: 'ds-community-list-page',
  templateUrl: './community-list-page.component.html',
})
export class CommunityListPageComponent {
  breadcrumbs$: Observable<Breadcrumb[]>;
  showBreadcrumbs$: Observable<boolean>;

  constructor(
    private breadcrumbsService: BreadcrumbsService
  ) {
    this.breadcrumbs$ = breadcrumbsService.breadcrumbs$;
    this.showBreadcrumbs$ = breadcrumbsService.showBreadcrumbs$;
  }

}
