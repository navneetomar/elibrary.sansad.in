import { Component } from '@angular/core';
import { EditTopicSelectorComponent } from './edit-topic-selector.component';
import { ThemedComponent } from 'src/app/shared/theme-support/themed.component';

/**
 * Themed wrapper for EditCommunitySelectorComponent
 */
@Component({
  selector: 'ds-themed-edit-topic-selector',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
})
export class ThemedEditTopicSelectorComponent extends ThemedComponent<EditTopicSelectorComponent> {
  protected getComponentName(): string {
    return 'EditTopicSelectorComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(
      `../../../../../themes/${themeName}/app/shared/dso-selector/modal-wrappers/edit-topic-selector/edit-topic-selector.component`
    );
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./edit-topic-selector.component');
  }
}
