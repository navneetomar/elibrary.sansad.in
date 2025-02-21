import { Component } from '@angular/core';
import { ThemedComponent } from '../shared/theme-support/themed.component';
import { TopicListPageComponent } from './topic-list-page.component';

/**
 * Themed wrapper for CommunityListPageComponent
 */
@Component({
  selector: 'ds-themed-topic-list-page',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
})
export class ThemedTopicListPageComponent extends ThemedComponent<TopicListPageComponent> {
  protected getComponentName(): string {
    return 'TopicListPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(
      `../../themes/${themeName}/app/topic-list-page/topic-list-page.component`
    );
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./topic-list-page.component`);
  }
}
