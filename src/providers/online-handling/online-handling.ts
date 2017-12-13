import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';

import { tableNames } from '../../app/app.firebaseconfig';
import { LoghandlingProvider } from '../../providers/loghandling/loghandling';

/*
  Generated class for the OnlineHandlingProvider provider.
  Set user online and get current lat lon, update it on fire
*/
@Injectable()
export class OnlineHandlingProvider {

  firedata = firebase.database().ref(tableNames.OnlineUser);
  private TAG: string = "OnlineHandlingProvider";

  constructor(private angularFireDatabase: AngularFireDatabase,private loghandlingProvider: LoghandlingProvider) {
    
  }

  /**
   * Add user for online list.
   * @param userId user uid identification.
   * @param username user name.
   * @param lat user's current latitude.
   * @param lon user's current longitude.
   */
  setUserOnline(userId: string, username: string , lat: number, lon: number) {

    return this.firedata.child(userId).set({
            name: username,
            uid: userId,
            latitude: lat,
            longitude: lon,
            timestamp: firebase.database['ServerValue']['TIMESTAMP']
          });
  }

  setUserOffline(userId: string){
    return this.firedata.child(userId).remove();
  }

  /**
   * Get messages for pertucular user.
   * @param channelId channel id for one two one messages.
   */
  checkActiveChatWith(userId: string) {
    return this.angularFireDatabase.list(`${tableNames.User}/${userId}/${"meta"}/${"message"}`)
    .map(uids => uids.map((item) => {
      return item;
    }));
  }

  updateUserStatus(userId: string){
    this.loghandlingProvider.showLog(this.TAG, "Updating status available");
    return this.angularFireDatabase.list(`${tableNames.User}`)
    .update(userId, {
      status: "AVAILABLE",
    });
  }

  deleteChat(userId: string, channelId: string){
    this.loghandlingProvider.showLog(this.TAG, "Deleting user chat.");
    return this.angularFireDatabase.object(`${tableNames.PersonalMessage}/${channelId}/${"meta"}/${"deleted_by"}`)
    .update({
      userId
    });
  }

  addFavoriteChat(userId: string, channelId: string){
    this.loghandlingProvider.showLog(this.TAG, "Adding user favorite.");
    return this.angularFireDatabase.list(`${tableNames.PersonalMessage}/${channelId}/${"meta"}/${"fav_by"}`)
    .push({
      userId
    });
  }

  isFavorited(channelId: string){
    this.loghandlingProvider.showLog(this.TAG, "From is fav method.");
    return this.angularFireDatabase.list(`${tableNames.PersonalMessage}/${channelId}/${"meta"}/${"fav_by"}`)
    .map(contacts => contacts.map((item) => {
      return item;
    }));
  }

}
