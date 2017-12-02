import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

import { tableNames } from '../../app/app.firebaseconfig';

/*
  Generated class for the OnlineHandlingProvider provider.
  Set user online and get current lat lon, update it on fire
*/
@Injectable()
export class OnlineHandlingProvider {

  firedata = firebase.database().ref(tableNames.OnlineUser);

  constructor() {
    
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
}
