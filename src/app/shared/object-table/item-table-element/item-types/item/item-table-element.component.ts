import { Component } from '@angular/core';
import { focusShadow } from '../../../../animations/focus';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { Item } from '../../../../../core/shared/item.model';

@listableObjectComponent('Publication', ViewMode.TableElement)
@listableObjectComponent(Item, ViewMode.TableElement)
@Component({
  selector: 'ds-item-table-element',
  styleUrls: ['./item-table-element.component.scss'],
  templateUrl: './item-table-element.component.html',
  animations: [focusShadow]
})
/**
 * The component for displaying a grid element for an item of the type Publication
 */
export class ItemTableElementComponent extends AbstractListableElementComponent<Item> {
}
