import { Subscription, Observable } from 'rxjs';

import { Component, Input, OnInit } from '@angular/core';
import { CommunityLogoService } from './community-logo.service';

/**
 * Component that can render a list of listable objects in different view modes
 */
@Component({
  selector: 'ds-community-logo',
  styleUrls: ['./community-logo.component.scss'],
  templateUrl: './community-logo.component.html',
})
export class CommunityLogoComponent implements OnInit {
  @Input() object;
  @Input() logoCommDefault;
  @Input() isHomePage;
  subcribe: Subscription;
  logoDefault = '../../../../../assets/images/cover_book_enhira.png';

  public results$: Observable<any>;
  constructor(private communityLogoService: CommunityLogoService) {}
  ngOnInit(): void {
    this.results$ = this.communityLogoService.getLogoComm(this.object);
    this.subcribe = this.results$.subscribe((data) => {
      if (
        data &&
        data._embedded &&
        data._embedded.logo &&
        data._embedded.logo._links.content &&
        data._embedded.logo._links.content.href
      ) {
        this.logoCommDefault = data._embedded.logo._links.content.href;
      } else {
        this.logoCommDefault = this.logoDefault;
        // this.logoCommDefault = null;
      }

      return data;
    });
  }
}
