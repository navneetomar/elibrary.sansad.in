import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoggedModalComponent } from 'src/app/shared/logged-user-modal/logged-modal.component';

@Injectable({
  providedIn: 'root'
})
export class LoggedModalService {

  constructor(private modalService: NgbModal) { }

  openModal() {
    console.log("===================modal fun")
    const modalRef = this.modalService.open(LoggedModalComponent);
    console.log("=================== after      modal fun")
    // You can pass data to the modal if needed
    // modalRef.componentInstance.data = ...;
  }
}
