import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ds-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
/**
 * Component displaying the Help Statement
 */
export class LandingPageComponent {
  constructor(private router: Router) {}
  showHomePageRegister(){
    
    this.router.navigate(['/login']);
  }
  showHomePageGuess(){
    this.router.navigate(['/home']);
  }
}
