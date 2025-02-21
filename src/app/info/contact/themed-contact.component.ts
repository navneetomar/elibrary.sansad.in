import { Component } from '@angular/core';
import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { ContactComponent } from './contact.component';

/**
 * Themed wrapper for PrivacyComponent
 */
@Component({
  selector: 'ds-themed-contact',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedContactComponent extends ThemedComponent<ContactComponent> {
  protected getComponentName(): string {
    return 'ContactComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/info/contact/contact.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./contact.component`);
  }

}
