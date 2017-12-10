import { Component } from '@angular/core';
import { IonicPage, App, ToastController } from 'ionic-angular';

import { AuthenticationProvider, UserModel } from '../../providers/authentication/authentication';
import { ChathandlingProvider, MessageModel } from '../../providers/chathandling/chathandling';

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

  constructor(private app: App, private toastController: ToastController, private authenticationProvider: AuthenticationProvider,
    private chathandlingProvider: ChathandlingProvider) {}
  
  /**
   * Called after view load.
   */
  ionViewDidLoad() {
    this.authenticationProvider.getFullProfile()
      .subscribe((user: any) => this.user = user);
    
    this.chathandlingProvider.getLastMessages()
      .subscribe((messages) => this.messages = messages);
  }

  /**
   * join default chat chanel
   */
  joinDefaultChannel(channel: string | any = 'general') {
    this.app.getRootNav().setRoot('ChatMessagePage', {user: this.user});
  }

  /**
   * join personal chat chanel
   */
  joinPerosnalChannel(channel: string | any = 'general') {
    this.app.getRootNav().push('ChatMessagePage', {user: this.user});
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

}
