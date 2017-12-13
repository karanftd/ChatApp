import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, Platform, TextInput, Content, LoadingController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

import { ChathandlingProvider } from '../../providers/chathandling/chathandling';
import { AuthenticationProvider , UserModel } from '../../providers/authentication/authentication';
import { LoghandlingProvider } from '../../providers/loghandling/loghandling';
import { MessageimagehandlerProvider } from '../../providers/messageimagehandler/messageimagehandler';
import { ActionSheetProvider } from '../../providers/action-sheet/action-sheet';

/**
 * Generated class for the OneTwoOnePage page.
 * One two one chat page.
 */

@IonicPage()
@Component({
  selector: 'page-one-two-one',
  templateUrl: 'one-two-one.html',
})
export class OneTwoOnePage {

  private TAG: string = 'OneTwoOnePage';
  chatText: string = '';
  chatMessages: Array<string>;
  textMaxLength: number = 400;
  user: UserModel;
  channelId: string;
  loading: any;
  uid :string;

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
   * @param authenticationProvider authentication provider.
   */
  constructor( 
    private navParams: NavParams,
    private platform: Platform,
    private keyboard: Keyboard,
    private chatProvider: ChathandlingProvider,
    private loghandlingProvider: LoghandlingProvider,
    private loadingController:LoadingController,
    private messageimagehandlerProvider: MessageimagehandlerProvider, 
    private authenticationProvider: AuthenticationProvider,
    private actionSheetProvider: ActionSheetProvider) {
    this.user = this.navParams.get('user');

    this.loading = this.loadingController.create({
      content: 'Please wait'
    });

    this.uid = this.navParams.get('uid');

    this.authenticationProvider.getFullProfile()
      .subscribe((user: any) => {
        this.user = user

        if(this.user.uid > this.uid)
        {
          this.channelId = this.user.uid + "-" + this.uid;
        }else {
          this.channelId = this.uid + "-" + this.user.uid ;
        }

        this.loadData();
      });

  }

  /**
   * Load data for personal chennal.
   */
  loadData(){

    this.loghandlingProvider.showLog(this.TAG, this.channelId);

    this.chatProvider.getOneTwoOneMessages(this.channelId)
      .subscribe(messages => {this.chatMessages = messages;
      this.loghandlingProvider.showLog(this.TAG,"message subscribed")});

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
  }

  /**
   * Call send message method of chat provider on send button.
   * @param event specific event from button.
   */
  sendMessage(event: any) {
    if (!this.chatText)
      return;

    this.chatProvider.sendOneTwoOneMessage((this.user as any).$key, this.chatText, this.channelId)
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
    return new Date(timestamp).setHours(0,0,0,0) == new Date().setHours(0,0,0,0);
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
  sendPicMsg() {
    this.loading.present();
    this.messageimagehandlerProvider.imageMassegeUpload().then((imgurl) => {
      this.loading.dismiss();
      this.chatProvider.sendOneTwoOneMessage((this.user as any).$key, imgurl.toString() , this.channelId)
      .then(() => {
        this.chatText = '';
        this.scrollDown();
      }, (error) => {
        this.loghandlingProvider.showLog(this.TAG, error.toString());
        this.loading.dismiss();
      })
    }).catch((err) => {
      alert(err);
      this.loading.dismiss();
    })
  }

  /**
   * Generate action sheet for different things.
   */
  presentActionSheet() {
    this.actionSheetProvider.presentActionSheet();
  }

}
