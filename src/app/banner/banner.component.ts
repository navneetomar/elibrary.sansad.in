import { Component, AfterViewChecked, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Component representing the breadcrumbs of a page
 */
@Component({
  selector: 'ds-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent{
  @Input() imgUrl: any;
  @Input() title: any;
  @Input() description: any;
  @Input() isCollComm = false;
  /**
   * Observable of the list of breadcrumbs for this page
   */

  /**
   * Whether or not to show breadcrumbs on this page
   */
  constructor(
    public router: Router
  ) {
  }
}
