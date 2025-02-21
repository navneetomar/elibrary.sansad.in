import { Component } from '@angular/core';
import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { LandingPageComponent } from './landing-page.component';

/**
 * Themed wrapper for PrivacyComponent
 */
@Component({
  selector: 'ds-themed-landing-page',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedLandingPageComponent extends ThemedComponent<LandingPageComponent> {
  protected getComponentName(): string {
    return 'LandingPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/info/landing-page/landing-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./landing-page.component`);
  }

}
