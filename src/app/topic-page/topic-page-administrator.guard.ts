import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Topic } from '../core/shared/topic.model';
import { TopicPageResolver } from './topic-page.resolver';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { Observable, of as observableOf } from 'rxjs';
import { DsoPageSingleFeatureGuard } from '../core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { AuthService } from '../core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
/**
 * Guard for preventing unauthorized access to certain {@link Topic} pages requiring administrator rights
 */
export class TopicPageAdministratorGuard extends DsoPageSingleFeatureGuard<Topic> {
  constructor(
    protected resolver: TopicPageResolver,
    protected authorizationService: AuthorizationDataService,
    protected router: Router,
    protected authService: AuthService
  ) {
    super(resolver, authorizationService, router, authService);
  }

  /**
   * Check administrator authorization rights
   */
  getFeatureID(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<FeatureID> {
    return observableOf(FeatureID.AdministratorOf);
  }
}
