import { Component } from '@angular/core';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../core/shared/context.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { SidebarSearchListElementComponent } from '../sidebar-search-list-element.component';
import { TopicSearchResult } from '../../../object-collection/shared/topic-search-result.model';
import { Topic } from '../../../../core/shared/topic.model';

@listableObjectComponent(
  TopicSearchResult,
  ViewMode.ListElement,
  Context.SideBarSearchModal
)
@listableObjectComponent(
  TopicSearchResult,
  ViewMode.ListElement,
  Context.SideBarSearchModalCurrent
)
@Component({
  selector: 'ds-collection-sidebar-search-list-element',
  templateUrl: '../sidebar-search-list-element.component.html',
})
/**
 * Component displaying a list element for a {@link CommunitySearchResult} within the context of a sidebar search modal
 */
export class TopicSidebarSearchListElementComponent extends SidebarSearchListElementComponent<
  TopicSearchResult,
  Topic
> {
  /**
   * Get the description of the Community by returning its abstract
   */
  getDescription(): string {
    return this.firstMetadataValue('dc.description.abstract');
  }
}
