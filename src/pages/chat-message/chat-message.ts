import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IonicPage, NavParams, Platform, TextInput, Content } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

import { ChathandlingProvider } from '../../providers/chathandling/chathandling';
import { UserModel } from '../../providers/authentication/authentication';

@IonicPage()
@Component({
  selector: 'page-chat-message',
  templateUrl: 'chat-message.html',
})
export class ChatMessagePage implements OnInit, OnDestroy {
  chatText: string = '';
  chatMessages: Array<string>;
  textMaxLength: number = 400;
  user: UserModel;

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
   */
  constructor( 
    private navParams: NavParams,
    private platform: Platform,
    private keyboard: Keyboard,
    private chatProvider: ChathandlingProvider,) {
    this.user = this.navParams.get('user');
  }

  /**
   * execute after view loaded.
   */
  ionViewDidLoad() {
    this.chatProvider.getMessages()
      .subscribe((messages => this.chatMessages = messages));

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

    this.chatProvider.sendMessage((this.user as any).$key, this.chatText)
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
