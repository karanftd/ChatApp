import { Component } from '@angular/core';
import { IonicPage, App, ToastController, MenuController, LoadingController, ViewController} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { AuthenticationProvider, UserModel } from '../../providers/authentication/authentication';
import { ChathandlingProvider, MessageModel } from '../../providers/chathandling/chathandling';
import { LoghandlingProvider } from '../../providers/loghandling/loghandling';
import { ApihandlingProvider } from '../../providers/apihandling/apihandling';
import { ConstantProvider } from '../../providers/constant/constant';
import { OnlineHandlingProvider } from '../../providers/online-handling/online-handling';

/**
 * Generated class for the TabChatsPage page.
 *
 * Initial chat page.
 */

@IonicPage()
@Component({
  selector: 'page-tab-chats',
  templateUrl: 'tab-chats.html',
})
export class TabChatsPage {
  messages: Array<MessageModel>;
  user: UserModel;
  channelId: string;
  loading: any;
  private TAG: string = "TabChatsPage";
  uids: Array<string>;
  onlineStatus: boolean;

  constructor(private app: App, private toastController: ToastController, private authenticationProvider: AuthenticationProvider,
    private chathandlingProvider: ChathandlingProvider, private loghandlingProvider: LoghandlingProvider,
    private menuController: MenuController, private geolocation: Geolocation,
    private apihandlingProvider: ApihandlingProvider, private loadingController:LoadingController,
    private onlineHandlingProvider: OnlineHandlingProvider, private viewController: ViewController) {
      this.menuController.enable(true, 'navigation_menu');
  }
  
  /**
   * Called after view load.
   */
  ionViewDidLoad() {
    this.loghandlingProvider.showLog(this.TAG,'ionViewDidLoad');
    this.authenticationProvider.getFullProfile()
      .subscribe((user: any) => this.user = user);
    
    this.chathandlingProvider.getLastMessages()
      .subscribe((messages) => this.messages = messages);
  }

  /**
   * join default chat chanel
   */
  joinDefaultChannel(channel: string | any = 'general') {
    this.app.getRootNav().push('ChatMessagePage', {user: this.user});
  }

  /**
   * join personal chat chanel
   */
  joinPerosnalChannel(channel: string | any = 'general') {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.loghandlingProvider.showLog(this.TAG, 'Lat ' + resp.coords.latitude);
      this.loghandlingProvider.showLog(this.TAG, 'Lon ' + resp.coords.longitude);
    }).catch((error) => {
      this.loghandlingProvider.showLog(this.TAG, 'Error getting location ' + error);
    });

    this.onlineCheck();

    //this.app.getRootNav().push('ParsonalchatPage', {user: this.user});
  }

  /**
   * Currently stop direct chat.
   */
  joinDirectChat() {
    this.toastController.create({
      duration: 1500,
      position: 'top',
      message: 'Sorry, not allowed to chat directly.'
    }).present();
  }

  onlineCheck(){
    this.loading = this.loadingController.create({
      content: 'Please wait'
    });
    this.loading.present();
    this.onlineHandlingProvider.updateUserStatus(this.user.uid);
    this.loghandlingProvider.showLog(this.TAG, "calling api");
    let TIME_IN_MS = 2000;
    setTimeout(() => {
     this.apihandlingProvider.callRequest(ConstantProvider.BASE_URL + "getUserToChat?userid=" + this.user.uid).subscribe(res => {
      this.loghandlingProvider.showLog(this.TAG, JSON.stringify(res));
      this.loading.dismiss();
      if(res.success){
        this.onlineStatus = true;
        this.checkUserUpdate();
      }else{
        alert(res.message);
      }
    },err => {
      this.loading.dismiss();
      alert(JSON.stringify(err));
    });
  }, TIME_IN_MS);
    
  }

  checkUserUpdate(){
    this.loading = this.loadingController.create({
      content: 'Getting online user...'
    });
    this.loading.present();
    this.onlineHandlingProvider.checkActiveChatWith(this.user.uid)
    .subscribe(uid => {
      this.loghandlingProvider.showLog(this.TAG,"Page : " + this.viewController.name + " Flag : " + 
      ConstantProvider.getAlreadySubscribed());
      if(this.viewController.name != "ParsonalchatPage" && !ConstantProvider.getAlreadySubscribed())
      {
        this.uids = uid;
        if(this.uids.length > 0)
        {
          this.loading.dismiss();
          this.onlineStatus = false;
          let userId: any;
          userId = this.uids[0];
          this.loghandlingProvider.showLog(this.TAG,"uid added." + userId);
          if(this.user.uid > userId)
          {
            this.channelId = this.user.uid + "-" + userId;
          }else {
            this.channelId = userId + "-" + this.user.uid ;
          }
          this.loghandlingProvider.showLog(this.TAG,'Channel ID : ' + this.channelId);
          this.app.getRootNav().push('ParsonalchatPage', {user: this.user, channelId: this.channelId});
          ConstantProvider.setAlreadySubscribed(true);
        }
      }else{
        this.loading.dismiss();
        this.loghandlingProvider.showLog(this.TAG,"From subscribe already connected with one user.");
      }
    });
  }

}
