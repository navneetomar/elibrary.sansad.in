import { HostListener, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { LogOutAction } from '../../core/auth/auth.actions';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';


export enum IdleUserTimes {
  IdleTime = 900000,
  CountdownTime = 5000
}
export const LOGOUT_ROUTE = '/logout';
export const  LOGIN_ROUTE = '/login'

@Injectable({
  providedIn: 'root'
})
export class IsUserActiveService {
  private timeoutId: any;
  private countdownId: any;
  private countdownValue: number;

  userInactive: Subject<any> = new Subject();

  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHandler(event:Event) {
  //   // Your logic here
  //   // For example, ask the user if they are sure they want to leave the page
  //   const confirmationMessage = 'Are you sure you want to leave?';
  //   this.store.dispatch(new LogOutAction())
  //   //event.returnValue = confirmationMessage; // Required for some browsers
  // }
  /**
   * @constructor
   * @param {Store<State>} store
   * @param {Router} router
   */

  constructor(private authService :AuthService,private router : Router,    private store: Store<AppState>) {
    // this.reset();
    // this.initListener();
    // this.init()
  }


  initListener() {
    window.addEventListener('mousemove', () => this.reset());
    window.addEventListener('click', () => this.reset());
    window.addEventListener('keypress', () => this.reset());
    window.addEventListener('DOMMouseScroll', () => this.reset());
    window.addEventListener('mousewheel', () => this.reset());
    window.addEventListener('touchmove', () => this.reset());
    window.addEventListener('MSPointerMove', () => this.reset());
  }

  reset() {
    clearTimeout(this.timeoutId);
    clearTimeout(this.countdownId);
    this.startIdleTimer();
  }

  startIdleTimer() {
    this.timeoutId = setTimeout(() => {
      // console.log('Inactivity detected');
      this.startCountdown();
    }, IdleUserTimes.IdleTime);

    // this.authService.logout()
  }

  startCountdown() {
    this.countdownValue = IdleUserTimes.CountdownTime / 1000;
    this.countdownId = setInterval(() => {
      this.countdownValue--;
      // console.log('You will logout in:', this.countdownValue, 'seconds');
      if (this.countdownValue <= 0) {
        clearInterval(this.countdownId);

        this.userInactive.next(true);
        this.store.dispatch(new LogOutAction());
        this.router.navigate([LOGIN_ROUTE]);
  
      }
    }, 1000);
  }

}