import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, Events, LoadingController } from 'ionic-angular';

import { MessageimagehandlerProvider } from '../../providers/messageimagehandler/messageimagehandler';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';
import { LoghandlingProvider } from '../../providers/loghandling/loghandling';
import { AlerthandlingProvider } from '../../providers/alerthandling/alerthandling';

/**
 * Generated class for the TabProfilePage page.
 *
 * Update profile details.
 */

@IonicPage()
@Component({
  selector: 'page-tab-profile',
  templateUrl: 'tab-profile.html',
})
export class TabProfilePage {

  private avatar: string;
  private displayName: string = "Add nick name";
  private TAG: string = "TabProfilePage";

  /**
   * Default constructor.
   * @param navController navigation controller.
   * @param authenticationProvider authentication provider. 
   * @param ngZone ngzone.
   * @param alertController alert controller. 
   * @param messageimagehandlerProvider image handler provider.
   * @param localstorageProvider local storage provider.
   * @param events Events
   */
  constructor(
    private navController: NavController, 
    private authenticationProvider: AuthenticationProvider, 
    private ngZone: NgZone, 
    private messageimagehandlerProvider: MessageimagehandlerProvider,
    private localstorageProvider: LocalstorageProvider,
    private events: Events,
    private loadingController: LoadingController,
    private alerthandlingProvider: AlerthandlingProvider,
    private loghandlingProvider: LoghandlingProvider) {
  }

  /**
   * Before view load get user details.
   */
  ionViewWillEnter() {
    this.loaduserdetails();
  }
 
  /**
   * Execute get user details method of authentication provider. 
   */
  loaduserdetails() {
    this.authenticationProvider.getuserdetails().then((res: any) => {
      if(res.displayName)
        this.displayName = res.displayName;
      this.ngZone.run(() => {
        this.avatar = res.photoURL;
      })
    })
  }

  /**
   * Edit display name.
   */
  editname() {
    this.alerthandlingProvider.editAlert('Edit Nickname', 'nickname', 'Nickname').then((data: any) => {
      if (data.nickname) {
        this.authenticationProvider.updatedisplayname(data.nickname).then((res: any) => {
          if (res.success) {

            this.localstorageProvider.setUsername(data.nickname);
            this.events.publish('user:displayName updated', data.nickname);
            this.alerthandlingProvider.presentAlert("Updated","Your nickname has been changed successfully!!");
            this.ngZone.run(() => {
              this.displayName = data.nickname;
            })
          }
          else {
            this.alerthandlingProvider.presentAlert("Failed","Your nickname was not changed.");
          }              
        })
      }
    }, err => {
      this.loghandlingProvider.showLog(this.TAG, "user cancelled.");
    });
  }

  /**
   * Edit profile picture.
   */
  editimage() {
    let loading: any;
    loading = this.loadingController.create({
      content: 'Updating profile picture...'
    });
    loading.present();
    this.messageimagehandlerProvider.uploadimage().then((url: any) => {
      this.authenticationProvider.updateimage(url).then((res: any) => {
        loading.present();
        if (res.success) {
          this.alerthandlingProvider.presentAlert("Updated","Your profile pic has been changed successfully!!");
          this.ngZone.run(() => {
          this.avatar = url;
        })  
        }  
      }).catch((err) => {
        loading.present();
        this.alerthandlingProvider.presentAlert("Failed","Your profile pic was not changed.");
      })
    })
  }
 
  /**
   * User sign out.
   */
  logout() {
    this.authenticationProvider.signOut()
      .then(() => this.navController.setRoot('LoginPage'));
  }

}
