import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { hasValue } from '../../../empty.util';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DSOSelectorModalWrapperComponent,
  SelectorActionType,
} from '../dso-selector-modal-wrapper.component';
import {
  getTopicCreateRoute,
  TOPIC_PARENT_PARAMETER,
} from '../../../../topic-page/topic-page-routing-paths';

/**
 * Component to wrap a button - for top communities -
 * and a list of parent communities - for sub communities
 * inside a modal
 * Used to create a new community
 */

@Component({
  selector: 'ds-create-topic-parent-selector',
  styleUrls: ['./create-topic-parent-selector.component.scss'],
  templateUrl: './create-topic-parent-selector.component.html',
})
export class CreateTopicParentSelectorComponent
  extends DSOSelectorModalWrapperComponent
  implements OnInit
{
  objectType = DSpaceObjectType.TOPIC;
  selectorTypes = [DSpaceObjectType.TOPIC];
  action = SelectorActionType.CREATE;

  constructor(
    protected activeModal: NgbActiveModal,
    protected route: ActivatedRoute,
    private router: Router
  ) {
    super(activeModal, route);
  }

  /**
   * Navigate to the community create page
   */
  navigate(dso: DSpaceObject) {
    let navigationExtras: NavigationExtras = {};
    if (hasValue(dso)) {
      navigationExtras = {
        queryParams: {
          [TOPIC_PARENT_PARAMETER]: dso.uuid,
        },
      };
    }
    this.router.navigate([getTopicCreateRoute()], navigationExtras);
  }
}
