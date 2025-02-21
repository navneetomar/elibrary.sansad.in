import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { TopicPageSubTopicListComponent } from './topic-page-sub-topic-list.component';
import { Component, Input } from '@angular/core';
import { Topic } from '../../core/shared/topic.model';

@Component({
  selector: 'ds-themed-topic-page-sub-topic-list',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedTopicPageSubTopicListComponent extends ThemedComponent<TopicPageSubTopicListComponent> {
  @Input() topic: Topic;
  @Input() pageSize: number;
  protected inAndOutputNames: (keyof TopicPageSubTopicListComponent &
    keyof this)[] = ['topic', 'pageSize'];

  protected getComponentName(): string {
    return 'TopicPageSubTopicListComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(
      `../../../themes/${themeName}/app/topic-page/sub-topic-list/topic-page-sub-topic-list.component`
    );
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./topic-page-sub-topic-list.component`);
  }
}
