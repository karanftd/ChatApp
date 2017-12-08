import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, MenuController } from 'ionic-angular';

import { LoghandlingProvider } from '../../providers/loghandling/loghandling';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { usercredentials } from '../../models/interfaces/usercredentials';

/**
 * Generated class for the LoginPage page.
 *
 * Login page provide user authentication using  email-password or facebook.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private TAG: string = "LoginPage";
  credentials = {} as usercredentials;

  /**
   * Default constructor
   * @param navCtrl navigation controller  
   * @param loadingCtrl loading controller (loading indication)
   * @param authenticationProvider authentication provider different auth methods
   * @param loghandlingProvider log handler 
   * @param apihandlingProvider provider having methods for api calling
   * @param menuController used for disable menu.
   */
  constructor(private navCtrl: NavController, private loadingCtrl: LoadingController,
  private authenticationProvider: AuthenticationProvider, private loghandlingProvider: LoghandlingProvider,
  private menuController: MenuController) {
    this.menuController.enable(false, 'navigation_menu');

    
  }

  /**
   * Method called from login with facebook button for authenticating user with facebook.
   */
  loginWithFacebook() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.authenticationProvider.signInWithFacebook()
      .then((res) => {
        this.loghandlingProvider.showLog(this.TAG, "Back to login.");
        if(res){
          this.loghandlingProvider.showLog(this.TAG, "user get auth token" + res.user);
          this.authenticationProvider.generateProfile(res.user || res);
          loading.dismiss();
        } else {
          loading.dismiss();
          alert(res);
        }
      }, (error) => {
        this.loghandlingProvider.showLog(this.TAG, "from error block" + error.message);
        loading.dismiss();
      });
  }

  /**
   * Method called from login with google button for authenticating user with google.
   */
  loginWithGoogle(){
    //google login 
    let loading = this.loadingCtrl.create();
    loading.present();
    this.authenticationProvider.signInWithGoogle()
      .then((res) => {
        this.loghandlingProvider.showLog(this.TAG, "user : " + JSON.stringify(res));
        this.authenticationProvider.generateProfile(res.user || res);
        loading.dismiss();
        this.navCtrl.setRoot('TabsPage');
      }, (error) => {
        this.loghandlingProvider.showLog(this.TAG, "error : " + JSON.stringify(error));
        loading.dismiss();
        this.showMessage(error && error.message);
      });
  }

  /**
   * Method called from login with github button for authenticating user with github.
   */
  loginWithGithub(){
    //github login
  }

  /**
   * Method called from login button for authenticating user with firebase user email and password.
   */
  signin(){
    let loading = this.loadingCtrl.create();
    loading.present();
     this.authenticationProvider.login(this.credentials).then((res: any) => {
      if (!res.code){
        this.loghandlingProvider.showLog(this.TAG, "user get auth token" + res.user);
        this.authenticationProvider.generateProfile(res.user || res);
        loading.dismiss();
        this.navCtrl.setRoot('TabsPage');
      }
      else{
        this.loghandlingProvider.showLog(this.TAG, "from error block" + res);
        loading.dismiss();
        alert(res);
      }
    })
  }

  signup(){
    this.navCtrl.push('SignupPage');
  }

  private showMessage(message: string) {
    //this.toastCtrl.create({message: message, duration: 3000}).present();
  }

}