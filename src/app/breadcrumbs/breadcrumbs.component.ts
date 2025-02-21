import { Component, AfterViewChecked } from '@angular/core';
import { Breadcrumb } from './breadcrumb/breadcrumb.model';
import { BreadcrumbsService } from './breadcrumbs.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Component representing the breadcrumbs of a page
 */
@Component({
  selector: 'ds-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements AfterViewChecked {
  /**
   * Observable of the list of breadcrumbs for this page
   */
  breadcrumbs$: Observable<Breadcrumb[]>;

  /**
   * Whether or not to show breadcrumbs on this page
   */
  showBreadcrumbs$: Observable<boolean>;
  isShowBreadcrumbsPage = true;
  constructor(
    private breadcrumbsService: BreadcrumbsService,
    public router: Router
  ) {
    this.breadcrumbs$ = breadcrumbsService.breadcrumbs$;
    this.showBreadcrumbs$ = breadcrumbsService.showBreadcrumbs$;
  }
  ngAfterViewChecked(): void {
    const url = this.router.routerState.snapshot.url;
    if (
      
      (url.toString().includes('/communities/') &&
        url.toString().split('/').length === 3) ||
      (url.toString().includes('/items/') &&
        url.toString().split('/').length === 3) ||
      (url.toString().includes('/collections/') &&
        url.toString().split('/').length === 3) ||
      (url.toString().includes('/topics/') &&
        url.toString().split('/').length === 3) ||
      (url.toString().includes('/items/') &&
        url.toString().includes('/full')) ||
      (url.toString().includes('/entities/publication/') &&
        url.toString().split('/').length === 4) ||
      (url.toString().includes('/entities/person/') &&
        url.toString().split('/').length === 4) ||
      (url.toString().includes('/entities/person/') &&
        url.toString().includes('/full')) ||
      (url.toString().includes('/entities/publication') &&
        url.toString().includes('/full')) ||
      (url.toString().includes('/entities/orgunit/') &&
        url.toString().split('/').length === 4) ||
      (url.toString().includes('/entities/orgunit/') &&
        url.toString().includes('/full')) ||
      (url.toString().includes('/entities/project/') &&
        url.toString().split('/').length === 4) ||
      (url.toString().includes('/entities/project/') &&
        url.toString().includes('/full')) ||
      (url.toString().includes('/entities/journal/') &&
        url.toString().includes('/full')) ||
      (url.toString().includes('/entities/journal/') &&
        url.toString().split('/').length === 4) ||
      (url.toString().includes('/entities/journalvolume/') &&
        url.toString().includes('/full')) ||
      (url.toString().includes('/entities/journalvolume/') &&
        url.toString().split('/').length === 4) ||
      (url.toString().includes('/entities/journalissue/') &&
        url.toString().includes('/full')) ||
      (url.toString().includes('/entities/journalissue/') &&
        url.toString().split('/').length === 4) ||
        url.toString().includes('/search') ||
        url.toString().includes('/community-list') ||
        url.toString().includes('/mydspace') ||
        url.toString().includes('/admin/workflow') ||
        url.toString().includes('/workflowitems/')
    ) {
      this.isShowBreadcrumbsPage = false;
    } else {
      this.isShowBreadcrumbsPage = true;
    }
  }
}
