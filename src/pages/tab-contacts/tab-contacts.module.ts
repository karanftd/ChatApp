import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabContactsPage } from './tab-contacts';

@NgModule({
  declarations: [
    TabContactsPage,
  ],
  imports: [
    IonicPageModule.forChild(TabContactsPage),
  ],
})
export class TabContactsPageModule {}
