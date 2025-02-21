import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { TopicListComponent } from './topic-list.component';
import { Component } from '@angular/core';

@Component({
  selector: 'ds-themed-topic-list',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedTopicListComponent extends ThemedComponent<TopicListComponent> {
  protected getComponentName(): string {
    return 'TopicListComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(
      `../../../themes/${themeName}/app/topic-list-page/topic-list/topic-list.component`
    );
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./topic-list.component`);
  }
}
