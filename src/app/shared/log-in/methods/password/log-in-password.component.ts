import { map } from 'rxjs/operators';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthenticateAction, ResetAuthenticationMessagesAction } from '../../../../core/auth/auth.actions';

import { getAuthenticationError, getAuthenticationInfo, } from '../../../../core/auth/selectors';
import { isNotEmpty } from '../../../empty.util';
import { fadeOut } from '../../../animations/fade';
import { AuthMethodType } from '../../../../core/auth/models/auth.method-type';
import { renderAuthMethodFor } from '../log-in.methods-decorator';
import { AuthMethod } from '../../../../core/auth/models/auth.method';
import { AuthService } from '../../../../core/auth/auth.service';
import { HardRedirectService } from '../../../../core/services/hard-redirect.service';
import { CoreState } from '../../../../core/core-state.model';
import { ConfigurationDataService } from 'src/app/core/data/configuration-data.service';
import { getFirstSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import * as CryptoJS from 'crypto-js';
import { IsUserActiveService } from 'src/app/core/isUserActive/isUserActive.service';

// import randomString from 'randomstring';






/**
 * /users/sign-in
 * @class LogInPasswordComponent
 */

const encryptionkey = "@uthorizationKey";
const iv = "0000000000000000";

@Component({
  selector: 'ds-log-in-password',
  templateUrl: './log-in-password.component.html',
  styleUrls: ['./log-in-password.component.scss'],
  animations: [fadeOut]
})
@renderAuthMethodFor(AuthMethodType.Password)
export class LogInPasswordComponent implements OnInit {

  /**
   * The authentication method data.
   * @type {AuthMethod}
   */
  public authMethod: AuthMethod;

  /**
   * The error if authentication fails.
   * @type {Observable<string>}
   */
  public error: Observable<string>;

  /**
   * Has authentication error.
   * @type {boolean}
   */
  public hasError = false;

  /**
   * The authentication info message.
   * @type {Observable<string>}
   */
  public message: Observable<string>;

  /**
   * Has authentication message.
   * @type {boolean}
   */
  public hasMessage = false;

  /**
   * The authentication form.
   * @type {FormGroup}
   */
  public form: FormGroup;

  recaptchaKey$: Observable<any>;

  token: string | undefined;
  password: string;
  email: string;
  captchaToken: string;
  captcha: string = this.generateCaptcha(6); // Generate CAPTCHA string
  feedback: string = '';
  isUserActiveFlag = false;

  /**
   * @constructor
   * @param {AuthMethod} injectedAuthMethodModel
   * @param {boolean} isStandalonePage
   * @param {AuthService} authService
   * @param {HardRedirectService} hardRedirectService
   * @param {FormBuilder} formBuilder
   * @param {Store<State>} store
   */
  constructor(
    @Inject('authMethodProvider') public injectedAuthMethodModel: AuthMethod,
    @Inject('isStandalonePage') public isStandalonePage: boolean,
    private authService: AuthService,
    private hardRedirectService: HardRedirectService,
    private formBuilder: FormBuilder,
    private store: Store<CoreState>,
    private configService: ConfigurationDataService,
    private isUserActive : IsUserActiveService,
    

    
  ) {
    this.authMethod = injectedAuthMethodModel;
    this.token = undefined;
    this.email = '';
    this.password = '';
  }
  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * @method ngOnInit
   */
  public ngOnInit() {

    // set formGroup
    // this.form = this.formBuilder.group({
    //   email: ['', Validators.required],
    //   password: ['', Validators.required],
    //   // token: ['',Validators.required],
    // });

    // set error
    this.error = this.store.pipe(select(
      getAuthenticationError),
      map((error) => {
        this.hasError = (isNotEmpty(error));
        return error;
      })
    );

    // set error
    this.message = this.store.pipe(
      select(getAuthenticationInfo),
      map((message) => {
        this.hasMessage = (isNotEmpty(message));
        return message;
      })
    );
    this.recaptchaKey$ = this.configService.findByPropertyName('google.recaptcha.key.site').pipe(
      getFirstSucceededRemoteDataPayload(),
    );
  }

  /**
   * Reset error or message.
   */
  public resetErrorOrMessage() {
    if (this.hasError || this.hasMessage) {
      this.store.dispatch(new ResetAuthenticationMessagesAction());
      this.hasError = false;
      this.hasMessage = false;
    }
  }

  /**
   * Submit the authentication form.
   * @method submit
   */
  // public submit() {
  //   this.resetErrorOrMessage();
  //   // get email and password values
  //   const email: string = this.form.get('email').value;
  //   const password: string = this.form.get('password').value;

  //   // trim values
  //   email.trim();
  //   password.trim();

  //   if (this.token){
  //     console.debug(`Token [${this.token}] generated`);
  //     if (!this.isStandalonePage) {
  //       this.authService.setRedirectUrl(this.hardRedirectService.getCurrentRoute());
  //     } else {
  //       this.authService.setRedirectUrlIfNotSet('/');
  //     }
  //     // dispatch AuthenticationAction
  //     this.store.dispatch(new AuthenticateAction(email, password));
  //     // clear form
  //     this.form.reset();
  //   } else {
  //     return;
  //   }
  // }
  public send(form: NgForm, event): void {

    if (form.invalid) {
      // for (const control of Object.keys(form.controls)) {
      //   form.controls[control].markAsTouched();
      // }
      this.verify();
      return;
    } else {
      this.verify();
      if (this.feedback === 'CAPTCHA incorrect. Please try again.') {
        return;
      }
      const passPhraseE = CryptoJS.lib.WordArray.random(16);
      const passPhrase = CryptoJS.lib.WordArray.random(16);
    let timeInMilliseconds=new Date().getTime()+5*1000;
   
      const email: string = this.encryptString(this.email,passPhraseE,timeInMilliseconds);
      const password: string = this.encryptString(this.password,passPhrase,timeInMilliseconds);
      let passPhrasePassword = password +passPhrase;
      let passPhraseEmail = email +passPhraseE;


      if (!this.isStandalonePage) {
        this.authService.setRedirectUrl(this.hardRedirectService.getCurrentRoute());
      } else {
        this.authService.setRedirectUrlIfNotSet('/');
      }
      // dispatch AuthenticationAction
      this.store.dispatch(new AuthenticateAction(passPhraseEmail, passPhrasePassword));
     
      

      // clear form
      this.form.reset();
    }
  }
  verify() {
    if (this.captchaToken === this.captcha) {
      this.feedback = 'CAPTCHA correct!';
    }
    // else if(){
    //   this.feedback = 'Wrong Username or Password.'
    // } 
  
    else {
      this.feedback = 'CAPTCHA incorrect. Please try again.';
    }
  }

  generateCaptcha(length: number): string { const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let captcha = ''; for (let i = 0; i < length; i++) { const randomIndex = Math.floor(Math.random() * charset.length); captcha += charset[randomIndex]; } return captcha; }

  

  encryptString(credential: any,passPhrase:any,timeInMilliseconds:any) {

    const key = CryptoJS.enc.Utf8.parse(encryptionkey);
    const ivVector = CryptoJS.enc.Utf8.parse(iv);
     
    const encryptedCredential = CryptoJS.AES.encrypt(credential+passPhrase+"_"+timeInMilliseconds, key, {
      iv: ivVector, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding
    }).toString();
   
    // return this.encryptAgain(encryptedCredential,passPhrase);
    return encryptedCredential
  }

// encryptAgain(encryptedData:any,passphrase:any){
// console.log("inside ="+encryptedData);

// const ivVector = CryptoJS.enc.Utf8.parse(iv);
// const key = CryptoJS.PBKDF2(passphrase, iv, { keySize: 256 / 32 });
// const decryptedCredential = CryptoJS.AES.decrypt(encryptedData, key, {
//   iv: CryptoJS.enc.Base64.parse(iv),
//   mode: CryptoJS.mode.CBC,
//   padding: CryptoJS.pad.ZeroPadding
// });

// // Re-encrypt the decrypted credential using the new passphrase
// const encryptedCredential = CryptoJS.AES.encrypt(decryptedCredential, key, {
//   iv: ivVector, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding
// }).toString();
// console.log("againEncyrpted=",encryptedCredential)
// return encryptedCredential;
// }

}


