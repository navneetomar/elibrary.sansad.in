import { Component } from '@angular/core';
import { ThemedComponent } from '../shared/theme-support/themed.component';
import { TopicPageComponent } from './topic-page.component';

/**
 * Themed wrapper for CommunityPageComponent
 */
@Component({
  selector: 'ds-themed-topic-page',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
})
export class ThemedTopicPageComponent extends ThemedComponent<TopicPageComponent> {
  protected getComponentName(): string {
    return 'TopicPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(
      `../../themes/${themeName}/app/topic-page/topic-page.component`
    );
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./topic-page.component`);
  }
}
