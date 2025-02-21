import { resolveTheme } from './../object-collection/shared/listable-object/listable-object.decorator';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DSpaceObject } from '../../core/shared/dspace-object.model';

@Component({
  selector: 'ds-confirmation-modal',
  templateUrl: 'confirmation-modal.component.html',
})
export class ConfirmationModalComponent implements OnInit {
  @Input() headerLabel: string;
  @Input() infoLabel: string;
  @Input() cancelLabel: string;
  @Input() confirmLabel: string;
  @Input() confirmIcon: string;

  @Input() isComfirmPolicy: boolean;
  /**
   * The brand color of the confirm button
   */
  @Input() brandColor = 'primary';

  @Input() dso: DSpaceObject;

  inheritPolicy = -1;
  inheritPolicies: number[] = [-1, 0, 1];

  applyToSub = false;
  /**
   * An event fired when the cancel or confirm button is clicked, with respectively false or true
   */
  @Output()
  response = new EventEmitter<boolean>();
  @Output()
  responsePolicy = new EventEmitter<{
    comfirm: boolean;
    inherit: number;
    applyToSub: boolean;
  }>();
  constructor(protected activeModal: NgbActiveModal) {}
  ngOnInit(): void {
    console.log(null);
  }

  /**
   * Confirm the action that led to the modal
   */
  confirmPressed() {
    this.response.emit(true);
    this.responsePolicy.emit({
      comfirm: true,
      inherit: this.inheritPolicy,
      applyToSub: this.applyToSub,
    });
    this.close();
  }

  /**
   * Cancel the action that led to the modal and close modal
   */
  cancelPressed() {
    this.response.emit(false);
    this.responsePolicy.emit({
      comfirm: true,
      inherit: this.inheritPolicy,
      applyToSub: this.applyToSub,
    });
    this.close();
  }

  /**
   * Close the modal
   */
  close() {
    this.activeModal.close();
  }
}
