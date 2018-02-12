import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//import { VideocallProvider } from '../../providers/videocall/videocall';

/**
 * Generated class for the TabsPage page.
 *
 * Provide tabs for chat contacts and profile.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tabChatRoot = 'TabChatsPage'
  tabContactsRoot = 'TabContactsPage'
  tabProfileRoot = 'TabProfilePage'

  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams,
    /*private videocallProvider: VideocallProvider*/) {
      //this.videocallProvider.InitializeApiRTC();
    }

}
