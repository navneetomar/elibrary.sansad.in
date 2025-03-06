import { Component, Input } from '@angular/core';
import { Collection } from '../../../core/shared/collection.model';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../object-collection/shared/listable-object/listable-object.decorator';
import { hasNoValue, hasValue } from '../../empty.util';
import { followLink } from '../../utils/follow-link-config.model';
import { LinkService } from '../../../core/cache/builders/link.service';
import { UltiService } from '../../../core/services/ulti.service';

/**
 * Component representing a grid element for collection
 */
@Component({
  selector: 'ds-collection-table-element',
  styleUrls: ['./collection-table-element.component.scss'],
  templateUrl: './collection-table-element.component.html',
})
@listableObjectComponent(Collection, ViewMode.TableElement)
export class CollectionTableElementComponent extends AbstractListableElementComponent<
  Collection
> {

  public totalItems: number = 0;
  private _object: Collection;

  constructor(private ultiService: UltiService, private linkService: LinkService) {
    super();
  }

  // @ts-ignore
  // @Input() set object(object: Collection) {
  //   this._object = object;
  //   if (hasValue(this._object) && hasNoValue(this._object.logo)) {
  //     this.linkService.resolveLink<Collection>(
  //       this._object,
  //       followLink('logo')
  //     );
  //   }
  // }

  @Input() set object(object: Collection) {
    this._object = object;
    if (hasValue(this._object) && hasNoValue(this._object.logo)) {
      this.linkService.resolveLink<Collection>(
        this._object,
        followLink('logo')
      );
    }
  
    // Fetch and set item count
    if (hasValue(this._object)) {
      this.ultiService.getCollectionItemCount(this._object.id).subscribe(count => {
        this.totalItems = count;
        console.log('Total Items', this.totalItems);
      });
    }
  }

  get object(): Collection {
    return this._object;
  }
}
