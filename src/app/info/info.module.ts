import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { EndUserAgreementComponent } from './end-user-agreement/end-user-agreement.component';
import { InfoRoutingModule } from './info-routing.module';
import { EndUserAgreementContentComponent } from './end-user-agreement/end-user-agreement-content/end-user-agreement-content.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { PrivacyContentComponent } from './privacy/privacy-content/privacy-content.component';
import { ThemedEndUserAgreementComponent } from './end-user-agreement/themed-end-user-agreement.component';
import { ThemedPrivacyComponent } from './privacy/themed-privacy.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackFormComponent } from './feedback/feedback-form/feedback-form.component';
import { ThemedFeedbackComponent } from './feedback/themed-feedback.component';
import { FeedbackGuard } from '../core/feedback/feedback.guard';
import { HelpComponent } from './help/help.component';
import { ThemedHelpComponent } from './help/themed-help.component';
import { HelpContentComponent } from './help/help-content/help-content.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ContactComponent } from './contact/contact.component';
import { ContactContentComponent } from './contact/contact-content/contact-content.component';
import { ThemedContactComponent } from './contact/themed-contact.component';
import { ThemedLandingPageComponent } from './landing-page/themed-landing-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const DECLARATIONS = [
  EndUserAgreementComponent,
  ThemedEndUserAgreementComponent,
  EndUserAgreementContentComponent,
  PrivacyComponent,
  PrivacyContentComponent,
  ThemedPrivacyComponent,
  FeedbackComponent,
  FeedbackFormComponent,
  ThemedFeedbackComponent,
  HelpComponent,
  HelpContentComponent,
  ThemedHelpComponent,
  ContactComponent,
  ContactContentComponent,
  ThemedContactComponent,
  ThemedLandingPageComponent,
  LandingPageComponent
];

@NgModule({
  imports: [CommonModule, DragDropModule, SharedModule, InfoRoutingModule],
  declarations: [...DECLARATIONS],
  exports: [...DECLARATIONS],
  providers: [FeedbackGuard],
})
export class InfoModule {}
