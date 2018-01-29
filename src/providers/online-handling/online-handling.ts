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
  private fireMessageData = firebase.database().ref(tableNames.PersonalMessage);
  private fireUserData = firebase.database().ref(tableNames.User);
  private TAG: string = "OnlineHandlingProvider";

  constructor(private angularFireDatabase: AngularFireDatabase, private loghandlingProvider: LoghandlingProvider) {

  }

  /**
   * Add user for online list.
   * @param userId user uid identification.
   * @param username user name.
   * @param lat user's current latitude.
   * @param lon user's current longitude.
   */
  setUserOnline(userId: string, username: string, lat: number, lon: number) {

    return this.firedata.child(userId).set({
      name: username,
      uid: userId,
      latitude: lat,
      longitude: lon,
      timestamp: firebase.database['ServerValue']['TIMESTAMP']
    });
  }

  setUserOffline(userId: string) {
    return this.firedata.child(userId).remove();
  }

  /**
   * Get messages for pertucular user.
   * @param channelId channel id for one two one messages.
   */
  checkActiveChatWith(userId: string) {
    
    return this.angularFireDatabase.list(`${tableNames.User}/${userId}/${"meta"}/${"message"}/${"active_chat_with"}`);

    /*return this.angularFireDatabase.object(tableNames.User + '/' + userId + '/' + 'meta' + '/' + 'message' + '/' + 'active_chat_with')
    .map(uids => uids.map((item) => {
      return item;
    }));*/
  }

  updateUserStatus(userId: string) {
    this.loghandlingProvider.showLog(this.TAG, "Updating status available");
    return this.angularFireDatabase.list(`${tableNames.User}`)
      .update(userId, {
        status: "AVAILABLE",
      });
  }

  deleteChat(userId: string, channelId: string) {
    this.loghandlingProvider.showLog(this.TAG, "Deleting user chat.");
    return this.angularFireDatabase.object(`${tableNames.PersonalMessage}/${channelId}/${"meta"}/${"deleted_by"}`)
      .update({
        userId
      });
  }

  addFavoriteChat(userId: string, channelId: string, key: number) {
    this.loghandlingProvider.showLog(this.TAG, "Adding user favorite.");
    if (key == 0) {
      return this.fireMessageData.child(channelId).child('meta').child('fav_by').update({
        '0': userId
      });
    } else {
      return this.fireMessageData.child(channelId).child('meta').child('fav_by').update({
        '1': userId
      });
    }
  }

  isFavorited(channelId: string) {
    this.loghandlingProvider.showLog(this.TAG, "From is fav method.");

    var promise = new Promise((resolve, reject) => {
      this.fireMessageData.child(channelId).child('meta').child('fav_by').once('value', (snapshot) => {
        resolve(snapshot.val());
      })
    })
    return promise;
  }

  updateApiRTCId(apiRTCId){
    this.loghandlingProvider.showLog(this.TAG, "Updating api rtc id to : " + apiRTCId);
    return this.angularFireDatabase.list(`${tableNames.User}`)
    .update(firebase.auth().currentUser.uid, {
      apiRTCId: apiRTCId,
    });
  }

  fatchApiRTCId(uid){
    this.loghandlingProvider.showLog(this.TAG, "Fatching api rtc id for : " + uid);

    /*var promise = new Promise((resolve, reject) => {
      this.fireUserData.child(uid).once('value', (snapshot) => {
        resolve(snapshot.val());
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;*/

    /*return this.angularFireDatabase.list(`${tableNames.User}/${uid}/${"apiRTCId"}`)
      .map(apiRTCId => apiRTCId.map((item) => {
        return item;
      }));*/

      return this.angularFireDatabase.object(tableNames.User + '/' + uid + '/' + 'apiRTCId');
    }

  }