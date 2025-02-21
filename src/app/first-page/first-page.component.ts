import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'ds-first-page',
  styleUrls: ['first-page.component.scss'],
  templateUrl: 'first-page.component.html'
})
export class FirstPageComponent {

  @Output() isShowHomePage = new EventEmitter<boolean>();
  constructor(private router: Router) {}
  showHomePageRegister(){
    this.isShowHomePage.emit(true);
    this.router.navigate(['/login']);
  }
  showHomePageGuess(){
    this.isShowHomePage.emit(true);
    this.router.navigate(['/home']);
    // if (this.ref) {
    //   this.ref.close();
    // }
  }
}
