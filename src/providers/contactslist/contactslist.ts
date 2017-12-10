import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { tableNames } from '../../app/app.firebaseconfig';

/*
  Generated class for the ContactslistProvider provider.

  Provide Contact list from users table.
*/
@Injectable()
export class ContactslistProvider {

  constructor(private angularFireDatabase: AngularFireDatabase) {

  }

  getContactsList(){
    return this.angularFireDatabase.list(tableNames.User, {query: {
      orderByChild: 'updatedAt'
    }}).map((contacts) => contacts.reverse());
  }

}
