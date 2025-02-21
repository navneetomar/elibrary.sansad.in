import { HostWindowService } from '../shared/host-window.service';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { SearchComponent } from '../shared/search/search.component';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { pushInOut } from '../shared/animations/push';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { RouteService } from '../core/services/route.service';
import { SearchService } from '../core/shared/search/search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsService } from '../breadcrumbs/breadcrumbs.service';
import { BrowseService } from '../core/browse/browse.service';
import { AuthService } from '../core/auth/auth.service';
import { Location } from '@angular/common';

/**
 * This component renders a search page using a configuration as input.
 */
@Component({
  selector: 'ds-configuration-search-page',
  styleUrls: ['../shared/search/search.component.scss'],
  templateUrl: '../shared/search/search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})

export class ConfigurationSearchPageComponent extends SearchComponent {
  constructor(protected service: SearchService,
              protected sidebarService: SidebarService,
              protected windowService: HostWindowService,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
              protected routeService: RouteService,
              protected breadcrumbsService: BreadcrumbsService,
              protected router: Router,
              protected route: ActivatedRoute,
              protected browseService: BrowseService,
              protected authService: AuthService,
              protected location: Location
              ) {
    super(service, sidebarService, windowService, searchConfigService, routeService, router,breadcrumbsService, route, browseService , authService, location);
  }
}
