import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IonicPage, NavParams, Platform, TextInput, Content, LoadingController, NavController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker } 
from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

import { ChathandlingProvider } from '../../providers/chathandling/chathandling';
import { UserModel } from '../../providers/authentication/authentication';
import { LoghandlingProvider } from '../../providers/loghandling/loghandling';
import { ConstantProvider } from '../../providers/constant/constant';
import { MessageimagehandlerProvider } from '../../providers/messageimagehandler/messageimagehandler';
import { OnlineHandlingProvider } from '../../providers/online-handling/online-handling';
import { AlerthandlingProvider } from '../../providers/alerthandling/alerthandling';
import { ActionSheetProvider } from '../../providers/action-sheet/action-sheet';
import { VideocallProvider } from '../../providers/videocall/videocall';

/**
 * Generated class for the ParsonalchatPage page.
 *
 * Page display list of messages for personal channel.
 */

@IonicPage()
@Component({
  selector: 'page-parsonalchat',
  templateUrl: 'parsonalchat.html',
})
export class ParsonalchatPage implements OnInit, OnDestroy {

  private TAG: string = 'ParsonalchatPage';
  private chatText: string = '';
  private chatMessages: Array<string>;
  private user: UserModel;
  private channelId: string;
  private favoriteFlag: any;
  private key: number;
  private map: GoogleMap;
  private elementMap: HTMLElement;
  private calleeId: string;

  showEmojiPicker = false;
  @ViewChild('chat_input') messageInput: TextInput;
  @ViewChild(Content) content: Content;

  private autoScroller: MutationObserver;

  /**
   * Default constructor.
   * @param navParams used to retrive user.
   * @param platform used for keyboard and scrolling related issue.
   * @param keyboard keyboard related handling
   * @param chatProvider chat handling
   * @param apihandlingProvider provides api methods.
   * @param loghandlingProvider log handling provider.
   * @param loadingController loading controller.
   * @param messageimagehandlerProvider handle image uploading on firebase.
   */
  constructor(
    private navParams: NavParams,
    private platform: Platform,
    private keyboard: Keyboard,
    private chatProvider: ChathandlingProvider,
    private loghandlingProvider: LoghandlingProvider,
    private loadingController: LoadingController,
    private messageimagehandlerProvider: MessageimagehandlerProvider,
    private onlineHandlingProvider: OnlineHandlingProvider,
    private alerthandlingProvider: AlerthandlingProvider,
    private navController: NavController,
    private actionSheetProvider: ActionSheetProvider,
    private geolocation: Geolocation,
    private googleMaps: GoogleMaps,
    private videocallProvider: VideocallProvider) {
    this.user = this.navParams.get('user');
    this.channelId = this.navParams.get('channelId');

    let userId = this.navParams.get('userId');

    this.onlineHandlingProvider.fatchApiRTCId(userId).forEach(element => {
      let user: any = JSON.stringify(element);
      this.loghandlingProvider.showLog(this.TAG, "user : " + user);
      for(let key in element){
        this.calleeId = element[key];
      }
    });

    this.loghandlingProvider.showLog(this.TAG, "calleeId : " + this.calleeId);
    
    this.checkFavorited().then((res: any) => {
      this.loghandlingProvider.showLog(this.TAG, "favorite flag : " + res);
      this.favoriteFlag = res;
    }).catch((err) => {
      this.favoriteFlag = false;
      alert(err);
    });


    this.loadData();
  }

  /**
   * Check whether user favorited chat or not.
   */
  checkFavorited() {
    var promise = new Promise((resolve, reject) => {
      this.onlineHandlingProvider.isFavorited(this.channelId).then((res: any) => {
        if(res){
          this.key = res.length;
          res.forEach(element => {
            this.loghandlingProvider.showLog(this.TAG, "Contact : " + (element));
            if(element == this.user.uid)
            {
              resolve(true);
            }
          });
          resolve(false);
        }
        else{
          this.key = 0;
          resolve(false);
        }
      }).catch((err) => {
        alert(err);
      });
    })
    return promise;
  }

  /**
   * Load data for personal chennal.
   */
  loadData() {
    this.loghandlingProvider.showLog(this.TAG, this.channelId);

    this.chatProvider.getPersonalMessages(this.channelId)
      .subscribe(messages => {
        if (messages.length > 0) {
          this.chatMessages = messages;
          this.loghandlingProvider.showLog(this.TAG, "message subscribed");
        }
      });

    if (this.platform.is('cordova')) {
      this.keyboard.onKeyboardShow()
        .subscribe(() => this.scrollDown());
    }
  }

  /**
   * Auto scroll page on init.
   */
  ngOnInit() {
    this.autoScroller = this.autoScroll();
  }

  /**
   * Disconnect scroller on destroy.
   */
  ngOnDestroy() {
    this.autoScroller.disconnect();
    ConstantProvider.setAlreadySubscribed(false);
  }

  /**
   * Call send message method of chat provider on send button.
   * @param event specific event from button.
   */
  sendMessage(event: any) {
    if (!this.chatText)
      return;

    this.chatProvider.sendPersonalMessage((this.user as any).$key, this.chatText, this.channelId)
      .then(() => {
        this.chatText = '';
        this.scrollDown();
      }, (error) => {
        this.loghandlingProvider.showLog(this.TAG, error.toString());
      });
  }

  /**
   * Compare received timestump with current one.
   * @param timestamp timestump to check
   */
  isToday(timestamp: number) {
    return new Date(timestamp).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
  }

  /**
   * Scroll down using scroller.
   */
  private scrollDown() {
    this.scroller.scrollTop = this.scroller.scrollHeight;
  }

  /**
   * Return auto scroller.
   */
  private autoScroll(): MutationObserver {
    const autoScroller = new MutationObserver(this.scrollDown.bind(this));

    autoScroller.observe(this.messageContent, {
      childList: true,
      subtree: true
    });

    return autoScroller;
  }

  /**
   * Get message content.
   */
  private get messageContent(): Element {
    return document.querySelector('.messages');
  }

  /**
   * Scroll message content. 
   */
  private get scroller(): Element {
    return this.messageContent.querySelector('.scroll-content');
  }

  /**
   * Method called on emoji button for appering emoji keyboard.
   */
  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.messageInput.setFocus();
    }
    this.content.resize();
    this.scrollToBottom();
  }

  /**
   * Scroll to bottom while emoji keyboard appered.
   */
  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  /**
   * Update flag for emoji picker and scroll to bottom.
   */
  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  /**
   * Send image as message from camera button.
   */
  sendPicMsg(tag: string) {
    let loading = this.loadingController.create();
    this.messageimagehandlerProvider.imageMassegeUpload(tag).then((imgurl) => {
      this.chatProvider.sendPersonalMessage((this.user as any).$key, imgurl.toString(), this.channelId)
        .then(() => {
          this.chatText = '';
          this.scrollDown();
        }, (error) => {
          this.loghandlingProvider.showLog(this.TAG, error.toString());
        })
    }).catch((err) => {
      alert(err);
    })
  }

  /**
   * Generates specific delete chat confirmation dialog.
   * @param e event specify direction of swipe.
   */
  swipeEvent(e) {
    if (e.direction == 4 || e.direction == 2) {
      this.deleteChatHandling();
    }
  }

  /**
   * On swipe delete chat.
   */
  deleteChatHandling() {
    this.alerthandlingProvider.confirmAlert("Confirm delete", "Are you sure you want to delete the chat?").then((res) => {
      if (this.favoriteFlag == false) {
        this.onlineHandlingProvider.deleteChat(this.user.uid, this.channelId);
        this.navController.pop();
        let loading = this.loadingController.create();
        loading.present();
        this.navController.setRoot("TabsPage");
        loading.dismiss();
      } else {
        this.loghandlingProvider.showLog(this.TAG, "No delete for Favorited user.");
      }
    }, err => {
      this.loghandlingProvider.showLog(this.TAG, "user cancelled.");
    });
  }

  /**
   * Add user entry for favorite.
   */
  addToFavorite() {
    this.favoriteFlag = true;
    this.onlineHandlingProvider.addFavoriteChat(this.user.uid, this.channelId, this.key);
  }

  /**
   * Generate action sheet for different things.
   */
  presentActionSheet() {
    this.actionSheetProvider.presentActionSheet().then((res) => {
      this.loghandlingProvider.showLog(this.TAG, 'res : ' + res);
      if (res == 'Camera'){
        this.sendPicMsg('Camera');
      }else if(res == 'Gallery'){
        this.sendPicMsg('Gallery');
      }else if(res == 'Location'){
        this.loghandlingProvider.showLog(this.TAG, 'from condition');
        let mapMessage: string;
        this.geolocation.getCurrentPosition().then((resp) => {          
          mapMessage = "{latitude:"+resp.coords.latitude+",longitude:"+resp.coords.longitude+"}";
          this.loghandlingProvider.showLog(this.TAG, 'location message : ' + mapMessage);
          this.generateMap(resp.coords.latitude, resp.coords.latitude);
          this.chatProvider.sendPersonalMessage((this.user as any).$key, mapMessage, this.channelId)
          .then(() => {
            this.chatText = '';
            this.scrollDown();
          }, (error) => {
            this.loghandlingProvider.showLog(this.TAG, error.toString());
          });
        }).catch((error) => {
          this.loghandlingProvider.showLog(this.TAG, 'Error getting location ' + error);
        });
      }else if(res == 'Contact'){
        
      }
    }, err => {
      this.loghandlingProvider.showLog(this.TAG, "Action sheet : " + err);
    });
  }

  parseLocationMessage(message){
    let jsonMessage = JSON.parse(message);
    this.generateMap(jsonMessage.latitude,jsonMessage.longitude);
  }

  generateMap(latitude: number, longitude: number){
    this.loghandlingProvider.showLog(this.TAG, 'From generate map.');
    this.elementMap = document.getElementById('mapcanvas');
    let mapOptions: GoogleMapOptions = {
       camera: {
         target: {
           lat: latitude,
           lng: longitude
         },
      zoom: 18,
      tilt: 30
       }
    };
    this.loghandlingProvider.showLog(this.TAG, 'Create map.');
    this.map = GoogleMaps.create(this.elementMap, mapOptions);
    this.map.one(GoogleMapsEvent.MAP_READY)
    .then(() => {
      this.loghandlingProvider.showLog(this.TAG, 'Map is Ready To Use');
    }, err => {
      this.loghandlingProvider.showLog(this.TAG, 'Map Error : ' + err);
    });
  }

  /*generateMap(latitude: number, longitude: number){
    let map: GoogleMap;

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: latitude,
          lng: longitude
        },
        zoom: 18,
        tilt: 30
      }
    };

    map = this.googleMaps.create('map_canvas', mapOptions);

    // Wait the MAP_READY before using any methods.
    map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        // Now you can use all methods safely.
        map.addMarker({
            title: 'Ionic',
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: latitude,
              lng: longitude
            }
          })

      });
  }*/

  makeVideoCall(){
    if(this.calleeId){
      this.videocallProvider.MakeCall(this.calleeId)
      this.navController.setRoot("IncomingCallPage");
    }else{
      alert("Not able to fatch callee Id.");
    }
    
  }

}
