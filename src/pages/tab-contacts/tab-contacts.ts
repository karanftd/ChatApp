import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, LoadingController, MenuController, App, Events } from 'ionic-angular';

import { ContactslistProvider } from '../../providers/contactslist/contactslist';
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';
import { LoghandlingProvider } from '../../providers/loghandling/loghandling';

/**
 * Generated class for the TabContactsPage page.
 *
 * Display list of contacts.
 */

@IonicPage()
@Component({
  selector: 'page-tab-contacts',
  templateUrl: 'tab-contacts.html',
})
export class TabContactsPage {
  
  private TAG: string = "TabContactsPage";
  private contactList: Array<any>;
  private presentUserList: string[] = [];
  private email: string;

  constructor(
    private app: App, 
    private loadingController: LoadingController, 
    private contactslistProvider: ContactslistProvider,
    private localstorageProvider: LocalstorageProvider,
    private menuController: MenuController,
    private events: Events,
    private loghandlingProvider: LoghandlingProvider,
    private changeDetectorRef: ChangeDetectorRef) {
    this.email = this.localstorageProvider.getEmail();
    this.menuController.enable(true, 'navigation_menu');
  }

  ionViewDidLoad() {
    let loading = this.loadingController.create();
    loading.present();

    this.contactslistProvider.getPresentUserList();

     this.events.subscribe('Present users updated', (presentUsers) => {
       this.loghandlingProvider.showLog(this.TAG, "Present users updated.");
       this.changeDetectorRef.markForCheck();
       this.presentUserList = presentUsers;
      });

    this.contactslistProvider.getContactsList().subscribe((contacts) => {
      this.contactList = contacts;
      loading.dismiss();
    })
  }

  checkOnlineStatus(userId: string){
    return (this.presentUserList.indexOf(userId)>-1);
  }
  
  joinChat(uid: string)
  {
    this.app.getRootNav().push('OneTwoOnePage', {uid: uid});
  }

}
