import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController } from 'ionic-angular';

import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LoghandlingProvider } from '../../providers/loghandling/loghandling';

/**
 * Generated class for the LoginPage page.
 *
 * Page allow user to create new accout.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  newuser = {
    email: '',
    password: '',
    displayName: '',
    photoURL: ''
  }
  private TAG: string = "SignupPage";

  constructor(private navController: NavController, private authenticationProvider: AuthenticationProvider,
              private loadingController: LoadingController, private toastController: ToastController,
              private loghandlingProvider: LoghandlingProvider) {
  }

  /**
   * Signup user using added credentials.
   */
  signup() {
    var toaster = this.toastController.create({
      duration: 3000,
      position: 'bottom'
    });
    if (this.newuser.email == '' || this.newuser.password == '' || this.newuser.displayName == '') {
      toaster.setMessage('All fields are required.');
      toaster.present();
    }
    else if (this.newuser.password.length < 7) {
      toaster.setMessage('Password is not strong. Try giving more than six characters.');
      toaster.present();
    }
    else {
      let loader = this.loadingController.create({
        content: 'Please wait'
      });
      loader.present();
      this.authenticationProvider.adduser(this.newuser).then((res: any) => {
        loader.dismiss();
        this.loghandlingProvider.showLog(this.TAG, 'Loader dismissed ' + 'res : ' + res.code);
        if (!res.code){
          this.loghandlingProvider.showLog(this.TAG, "user get auth token" + res.user);
          this.authenticationProvider.generateProfile(res.user || res);
          this.navController.setRoot('TabsPage');
        }
        else{
          this.loghandlingProvider.showLog(this.TAG, "from error block" + res);
          alert(res);
        }
      })
    }
  }  

  goback() {
    this.navController.setRoot('LoginPage');
  }

}
