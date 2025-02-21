import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { BreadcrumbsService } from '../breadcrumbs/breadcrumbs.service';
import { Breadcrumb } from '../breadcrumbs/breadcrumb/breadcrumb.model';

/**
 * Component representing the breadcrumbs of a page
 */
@Component({
  selector: 'ds-breadcrumbs-custom',
  templateUrl: './breadcrumbs-custom.component.html',
  styleUrls: ['./breadcrumbs-custom.component.scss'],
})
export class BreadcrumbsCustomComponent {
  /**
   * Observable of the list of breadcrumbs for this page
   */
  breadcrumbs$: Observable<Breadcrumb[]>;

  /**
   * Whether or not to show breadcrumbs on this page
   */
  showBreadcrumbs$: Observable<boolean>;

  constructor(private breadcrumbsService: BreadcrumbsService) {
    this.breadcrumbs$ = breadcrumbsService.breadcrumbs$;
    this.showBreadcrumbs$ = breadcrumbsService.showBreadcrumbs$;
  }
}
