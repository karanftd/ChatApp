import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IonicPage, NavParams, Platform, TextInput, Content, LoadingController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

import { ChathandlingProvider } from '../../providers/chathandling/chathandling';
import { UserModel } from '../../providers/authentication/authentication';
import { ApihandlingProvider } from '../../providers/apihandling/apihandling';
import { LoghandlingProvider } from '../../providers/loghandling/loghandling';
import { ConstantProvider } from '../../providers/constant/constant';

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
  chatText: string = '';
  chatMessages: Array<string>;
  textMaxLength: number = 400;
  user: UserModel;
  channelId: string;
  loading: any;

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
   */
  constructor( 
    private navParams: NavParams,
    private platform: Platform,
    private keyboard: Keyboard,
    private chatProvider: ChathandlingProvider,
    private apihandlingProvider: ApihandlingProvider,
    private loghandlingProvider: LoghandlingProvider,
    private loadingController:LoadingController) {
    this.user = this.navParams.get('user');

    this.loading = this.loadingController.create();

    this.loghandlingProvider.showLog(this.TAG, "calling api");
    this.loading.present();
    this.apihandlingProvider.callRequest(ConstantProvider.BASE_URL + "getUserToChat").subscribe(res => {
      this.channelId = res.uid + "-" + this.user.uid;
      this.loghandlingProvider.showLog(this.TAG,'Channel ID : ' + this.channelId);
      this.loadData();
    },err => {
      this.loghandlingProvider.showLog(this.TAG, err.message);
    });

  }

  /**
   * Load data for personal chennal.
   */
  loadData(){
    this.loghandlingProvider.showLog(this.TAG, this.channelId);

    this.chatProvider.getPersonalMessages(this.channelId)
      .subscribe((messages => this.chatMessages = messages));

    this.loading.dismiss();

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

    this.chatProvider.sendPersonalMessage((this.user as any).$key, this.chatText, this.channelId)
      .then(() => {
          this.chatText = '';
          this.scrollDown();
      }, (error) => {
          console.log(error);
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

}
