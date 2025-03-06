import { Component, Input } from '@angular/core';
import { Collection } from '../../../core/shared/collection.model';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../object-collection/shared/listable-object/listable-object.decorator';
import { Router } from '@angular/router';
import { hasNoValue, hasValue } from '../../empty.util';
import { followLink } from '../../utils/follow-link-config.model';
import { LinkService } from '../../../core/cache/builders/link.service';
import { UltiService } from '../../../core/services/ulti.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ds-collection-list-element',
  styleUrls: ['./collection-list-element.component.scss'],
  templateUrl: './collection-list-element.component.html'
})
/**
 * Component representing list element for a collection
 */
@listableObjectComponent(Collection, ViewMode.ListElement)
export class CollectionListElementComponent extends AbstractListableElementComponent<Collection> {

  public totalItems: number = 0;
  private subscription: Subscription;

  constructor(
    private ultiService: UltiService,
    private linkService: LinkService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit() {
    console.log(this.object);

    if (hasValue(this.object) && hasNoValue(this.object.logo)) {
      this.linkService.resolveLink<Collection>(
        this.object,
        followLink('logo')
      );
    }

    // Fetch and set item count
    if (hasValue(this.object)) {
      this.subscription = this.ultiService.getCollectionItemCount(this.object.id).subscribe(count => {
        this.totalItems = count;
      });
    }
  }

  openCollectionBySearchScope(objectId) {
    this.router.navigate(['/search'], {
      queryParams: { 'scope': objectId },
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Clean up subscription
    }
  }
}
