import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { AuthenticationProvider } from '../authentication/authentication';
import { tableNames } from '../../app/app.firebaseconfig';

/*
  Generated class for the ChathandlingProvider provider.
  
  This provider get/set messages for different pages.
*/
@Injectable()
export class ChathandlingProvider {
  constructor(private angularFireDatabase: AngularFireDatabase, public authenticationProvider: AuthenticationProvider) {}
  
  /**
   * Get all messages from table for general channel.
   * @param channelId channel id for chat messages.
   */
  getMessages(channelId: string = 'general') {

    return this.angularFireDatabase.list(`${tableNames.ChatMessage}/${channelId}`)
      .map(messages => messages.map((item) => {
        item.day = new Date(item.timestamp || Date.now()).getDate();

        if (item.from)
          item.user = this.authenticationProvider.getFullProfile(item.from);

          return item;
      }));
  }

  /**
   * Get last specific number of messages.
   * @param channelId channel id for chat messages.
   * @param count number of message count.
   */
  getLastMessages(channelId: string = 'general', count: number = 5) {
    return this.angularFireDatabase.list(`${tableNames.ChatMessage}/${channelId}`, {query: {
      limitToLast: 5,
      orderByPriority: true
    }}).map(messages => messages.reverse().map((item) => {
        if (item.from)
          item.user = this.authenticationProvider.getFullProfile(item.from);

          return item;
      }));
  }

  /**
   * Add entry in database for send message.
   * @param userId user id for from field.
   * @param message message string.
   * @param channelId channel id for chat messages.
   */
  sendMessage(userId: string, message: string, channelId: string = 'general') {
    return this.angularFireDatabase.list(`${tableNames.ChatMessage}/${channelId}`)
      .push({
        from: userId,
        message: message,
        timestamp: firebase.database['ServerValue']['TIMESTAMP']
      });
  }

}

/**
 * Message model class.
 */
export class MessageModel {
  channelId?: string;             // channelId
  from?: string;                  // userId
  messsage?: string;              // message body(text)
  image?: string | any;           // message body(image)
  timestamp?: string | Object     // firebase timestamp
}

/**
 * Channel model class.
 */
export class ChannelModel {
  name?: string;                   // channel name
  icon?: string;                   // channel icon
  members?: any;                   // member list
  lastMessage?: string;            // last message id
  timestamp?: string | Object;     // created / upadated time
}
