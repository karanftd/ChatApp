import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';

import { LoghandlingProvider } from '../../providers/loghandling/loghandling';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
//import { ConstantProvider } from '../../providers/constant/constant';
//import { ApihandlingProvider } from '../../providers/apihandling/apihandling';
import { usercredentials } from '../../models/interfaces/usercredentials';

/**
 * Generated class for the LoginPage page.
 *
 * Login page provide user authentication using facebook.
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
   */
  constructor(private navCtrl: NavController, private loadingCtrl: LoadingController,
  private authenticationProvider: AuthenticationProvider, private loghandlingProvider: LoghandlingProvider, 
  /*private apihandlingProvider: ApihandlingProvider*/) {
  }

  /**
   * Method called from login with facebook button for authenticating user with facebook.
   */
  loginWithFacebook() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.authenticationProvider.signInWithFacebook()
      .then((res) => {
        this.loghandlingProvider.showLog(this.TAG, "user get auth token" + res.user);
        loading.dismiss();
      }, (error) => {
        this.loghandlingProvider.showLog(this.TAG, "from error block" + error.message);
        loading.dismiss();
      });

    /*this.loghandlingProvider.showLog(this.TAG, "calling api");
    this.apihandlingProvider.callRequest(ConstantProvider.BASE_URL + "getUserToChat").subscribe(res => {
      this.loghandlingProvider.showLog(this.TAG, res.name +" : "+ res.uid);
    },err => {
      this.loghandlingProvider.showLog(this.TAG, err.message);
    });*/
  }

  /**
   * Method called from login with google button for authenticating user with google.
   */
  loginWithGoogle(){
    //google login 
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
        this.updateProfile(res.user || res);
        loading.dismiss();
        this.navCtrl.setRoot('TabsPage');
      }
      else{
        console.log("from error block" + res);
        loading.dismiss();
        alert(res);
      }
    })
  }

  private updateProfile(user: any){
    return this.authenticationProvider.updateProfile({
      uid        : user.uid,
      displayName: user.displayName,
      email      : user.email,
      photoURL   : user.photoURL,
      providerData   : user.providerData[0]
    });
  }

}
