import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';


@Component({
  selector: 'ds-home-sub-page',
  styleUrls: ['home-sub-page.component.scss'],
  templateUrl: 'home-sub-page.component.html'
})
export class HomeSubPageComponent {

  constructor(public router: Router, public ref: DynamicDialogRef) {}
  showHomePageRegister(){
    if (this.ref) {
      this.ref.close();
    }
    this.router.navigate(['/login']);
  }
  showHomePageGuess(){
    if (this.ref) {
      this.ref.close();
    }
  }
}
