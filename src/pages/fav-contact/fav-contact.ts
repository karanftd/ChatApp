import { Component } from '@angular/core';
import { IonicPage, LoadingController, MenuController, App } from 'ionic-angular';
import { ContactslistProvider } from '../../providers/contactslist/contactslist';
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';

/**
 * Generated class for the FavContactPage page.
 *
 * Display favorited contact list.
 */

@IonicPage()
@Component({
  selector: 'page-fav-contact',
  templateUrl: 'fav-contact.html',
})
export class FavContactPage {
  
  contactList: Array<any>;
  email: string;

  constructor(
    private app: App, 
    private loadingController: LoadingController, 
    private contactslistProvider: ContactslistProvider,
    private localstorageProvider: LocalstorageProvider,
    private menuController: MenuController
  ) {
    this.email = this.localstorageProvider.getEmail();
    this.menuController.enable(true, 'navigation_menu');
  }
}
