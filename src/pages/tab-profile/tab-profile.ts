import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, AlertController, Events } from 'ionic-angular';
import { MessageimagehandlerProvider } from '../../providers/messageimagehandler/messageimagehandler';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';

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

  avatar: string;
  displayName: string = "Add nick name";

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
    private alertController: AlertController,
    private messageimagehandlerProvider: MessageimagehandlerProvider,
    private localstorageProvider: LocalstorageProvider,
    private events: Events) {
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
    let statusalert = this.alertController.create({
      buttons: ['okay']
    });
    let alert = this.alertController.create({
      title: 'Edit Nickname',
      inputs: [{
        name: 'nickname',
        placeholder: 'Nickname'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
 
        }
      },
      {
        text: 'Edit',
        handler: data => {
          if (data.nickname) {
            this.authenticationProvider.updatedisplayname(data.nickname).then((res: any) => {
              if (res.success) {
                statusalert.setTitle('Updated');
                statusalert.setSubTitle('Your nickname has been changed successfully!!');

                this.localstorageProvider.setUsername(data.nickname);

                this.events.publish('user:displayName updated', data.nickname);

                statusalert.present();
                this.ngZone.run(() => {
                  this.displayName = data.nickname;
                })
              }
              else {
                statusalert.setTitle('Failed');
                statusalert.setSubTitle('Your nickname was not changed');
                statusalert.present();
              }              
            })
          }
        }
      }]
    });
    alert.present();
  }

  /**
   * Edit profile picture.
   */
  editimage() {
    let statusalert = this.alertController.create({
      buttons: ['okay']
    });
    this.messageimagehandlerProvider.uploadimage().then((url: any) => {
      this.authenticationProvider.updateimage(url).then((res: any) => {
        if (res.success) {
          statusalert.setTitle('Updated');
          statusalert.setSubTitle('Your profile pic has been changed successfully!!');
          statusalert.present();
          this.ngZone.run(() => {
          this.avatar = url;
        })  
        }  
      }).catch((err) => {
          statusalert.setTitle('Failed');
          statusalert.setSubTitle('Your profile pic was not changed');
          statusalert.present();
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
