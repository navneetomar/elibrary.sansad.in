import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { PRIVACY_PATH, END_USER_AGREEMENT_PATH, FEEDBACK_PATH, HELP_PATH, CONTACT_PATH, LANDING_PAGE_PATH } from './info-routing-paths';
import { ThemedEndUserAgreementComponent } from './end-user-agreement/themed-end-user-agreement.component';
import { ThemedPrivacyComponent } from './privacy/themed-privacy.component';
import { ThemedFeedbackComponent } from './feedback/themed-feedback.component';
import { ThemedHelpComponent } from './help/themed-help.component';
import { FeedbackGuard } from '../core/feedback/feedback.guard';
import { environment } from '../../environments/environment';
import { ThemedContactComponent } from './contact/themed-contact.component';
import { ThemedLandingPageComponent } from './landing-page/themed-landing-page.component';



const imports = [
  RouterModule.forChild([
    {
      path: FEEDBACK_PATH,
      component: ThemedFeedbackComponent,
      resolve: { breadcrumb: I18nBreadcrumbResolver },
      data: { title: 'info.feedback.title', breadcrumbKey: 'info.feedback' },
      canActivate: [FeedbackGuard]
    },
    {
      path: HELP_PATH,
      component: ThemedHelpComponent,
      resolve: { breadcrumb: I18nBreadcrumbResolver },
      data: { title: 'Help Statement', breadcrumbKey: 'info.help' }
    },
    {
      path: CONTACT_PATH,
      component: ThemedContactComponent,
      resolve: { breadcrumb: I18nBreadcrumbResolver },
      data: { title: 'Contact Statement', breadcrumbKey: 'info.contact' }
    },
    {
      path: LANDING_PAGE_PATH,
      component: ThemedLandingPageComponent,
      resolve: { breadcrumb: I18nBreadcrumbResolver },
      data: { title: 'Landing page', breadcrumbKey: 'info.contact' }
    }
  ],)
];

  if (environment.info.enableEndUserAgreement) {
    imports.push(
      RouterModule.forChild([
        {
          path: END_USER_AGREEMENT_PATH,
          component: ThemedEndUserAgreementComponent,
          resolve: { breadcrumb: I18nBreadcrumbResolver },
          data: { title: 'info.end-user-agreement.title', breadcrumbKey: 'info.end-user-agreement' }
        }
      ]));
  }
  if (environment.info.enablePrivacyStatement) {
    imports.push(
      RouterModule.forChild([
        {
          path: PRIVACY_PATH,
          component: ThemedPrivacyComponent,
          resolve: { breadcrumb: I18nBreadcrumbResolver },
          data: { title: 'info.privacy.title', breadcrumbKey: 'info.privacy' }
        }
      ]));
  }

@NgModule({
  imports: [
    ...imports
  ]
})
/**
 * Module for navigating to components within the info module
 */
export class InfoRoutingModule {
}
