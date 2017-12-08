import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Events } from 'ionic-angular';

import { tableNames } from '../../app/app.firebaseconfig';
import { LoghandlingProvider } from '../../providers/loghandling/loghandling';

/*
  Generated class for the ContactslistProvider provider.

  Provide Contact list from users table.
*/
@Injectable()
export class ContactslistProvider {

  private TAG: string = "ContactslistProvider";
  private firePresence = firebase.database().ref(tableNames.Presence);

  constructor(
    private angularFireDatabase: AngularFireDatabase,
    private loghandlingProvider: LoghandlingProvider,
    private events: Events,) {

  }

  getContactsList(){
    return this.angularFireDatabase.list(tableNames.User, {query: {
      orderByChild: 'updatedAt'
    }}).map((contacts) => contacts.reverse());
  }

  getPresentUserList(){
    
    this.firePresence.on('value', (snapshot) => {
      let presentUserList: string[] = [];
      for(let key in snapshot.val()){
        this.loghandlingProvider.showLog(this.TAG, key);
        presentUserList.push(key);
      }

      this.events.publish('Present users updated', presentUserList);
    })
  }

}
