import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DSOSelectorModalWrapperComponent,
  SelectorActionType,
} from '../dso-selector-modal-wrapper.component';
import { getTopicEditRoute } from '../../../../topic-page/topic-page-routing-paths';

/**
 * Component to wrap a list of existing communities inside a modal
 * Used to choose a community from to edit
 */

@Component({
  selector: 'ds-edit-topic-selector',
  templateUrl: '../dso-selector-modal-wrapper.component.html',
})
export class EditTopicSelectorComponent
  extends DSOSelectorModalWrapperComponent
  implements OnInit
{
  objectType = DSpaceObjectType.TOPIC;
  selectorTypes = [DSpaceObjectType.TOPIC];
  action = SelectorActionType.EDIT;
  @Output() isEditTopic = true;
  constructor(
    protected activeModal: NgbActiveModal,
    protected route: ActivatedRoute,
    private router: Router
  ) {
    super(activeModal, route);
  }

  /**
   * Navigate to the topic edit page
   */
  navigate(dso: DSpaceObject) {
    this.router.navigate([getTopicEditRoute(dso.uuid)]);
  }
}
