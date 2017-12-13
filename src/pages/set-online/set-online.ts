import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { LoghandlingProvider } from '../../providers/loghandling/loghandling';
import { OnlineHandlingProvider } from '../../providers/online-handling/online-handling';
import { AuthenticationProvider, UserModel } from '../../providers/authentication/authentication';

/**
 * Generated class for the SetOnlinePage page.
 * Allow user to set status online for other user.
 */

@IonicPage()
@Component({
  selector: 'page-set-online',
  templateUrl: 'set-online.html',
})
export class SetOnlinePage {

  onlineStatus: boolean;
  private TAG: string = "SetOnlinePage";
  user: UserModel;
  uids: Array<string>;

  constructor(
    private loghandlingProvider: LoghandlingProvider,
    private onlineHandlingProvider: OnlineHandlingProvider,
    private geolocation: Geolocation,
    private authenticationProvider: AuthenticationProvider) {
      this.authenticationProvider.getFullProfile()
      .subscribe((user: any) => {
        this.user = user;
      });
    }

  changeToggle(){
    if(this.onlineStatus == true){
      this.loghandlingProvider.showLog(this.TAG, 'online status true');

      this.geolocation.getCurrentPosition().then((resp) => {
        this.loghandlingProvider.showLog(this.TAG, 'Lat ' + resp.coords.latitude);
        this.loghandlingProvider.showLog(this.TAG, 'Lon ' + resp.coords.longitude);

        this.onlineHandlingProvider.setUserOnline(this.user.uid,this.user.displayName,resp.coords.latitude,resp.coords.longitude).
        then(() => {
          this.loghandlingProvider.showLog(this.TAG, 'Added user for online.');
          this.checkUserUpdate();      
        }, (error) => {
          this.loghandlingProvider.showLog(this.TAG, 'Error for adding user online.');
        });        
      }).catch((error) => {
        this.loghandlingProvider.showLog(this.TAG, 'Error getting location ' + error);
      });
    }else{
      this.loghandlingProvider.showLog(this.TAG, 'online status false');

      this.onlineHandlingProvider.setUserOffline(this.user.uid).
      then(() => {
        this.loghandlingProvider.showLog(this.TAG, 'Removed user from online.');
      }, (error) => {
        this.loghandlingProvider.showLog(this.TAG, 'Error for removing user from online.');
      });
    }
  }

  checkUserUpdate(){
    this.onlineHandlingProvider.checkActiveChatWith(this.user.uid)
    .subscribe(uid => {this.uids = uid;
      this.loghandlingProvider.showLog(this.TAG,"uid added." + this.uids.values)});
  }
}
