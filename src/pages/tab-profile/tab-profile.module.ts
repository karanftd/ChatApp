import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabProfilePage } from './tab-profile';

@NgModule({
  declarations: [
    TabProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(TabProfilePage),
  ],
})
export class TabProfilePageModule {}
