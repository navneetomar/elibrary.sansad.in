import { Component } from '@angular/core';
import { CreateTopicParentSelectorComponent } from './create-topic-parent-selector.component';
import { ThemedComponent } from 'src/app/shared/theme-support/themed.component';

/**
 * Themed wrapper for CreateCommunityParentSelectorComponent
 */
@Component({
  selector: 'ds-themed-create-topic-parent-selector',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
})
export class ThemedCreateTopicParentSelectorComponent extends ThemedComponent<CreateTopicParentSelectorComponent> {
  protected getComponentName(): string {
    return 'CreateTopicParentSelectorComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(
      `../../../../../themes/${themeName}/app/shared/dso-selector/modal-wrappers/create-topic-parent-selector/create-topic-parent-selector.component`
    );
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./create-topic-parent-selector.component');
  }
}
