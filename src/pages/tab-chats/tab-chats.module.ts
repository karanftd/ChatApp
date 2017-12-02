import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabChatsPage } from './tab-chats';
import { PreloadImageComponentModule } from '../../components/preload-image/preload-image.module';
import { Geolocation } from '@ionic-native/geolocation';

@NgModule({
  declarations: [
    TabChatsPage,
  ],
  imports: [
    IonicPageModule.forChild(TabChatsPage),
    PreloadImageComponentModule
  ],
  providers: [
    Geolocation,
  ],
})
export class TabChatsPageModule {}
