import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParsonalchatPage } from './parsonalchat';
import { EmojiPickerComponentModule } from "../../components/emoji-picker/emoji-picker.module";
import { EmojiProvider } from "../../providers/emojiprovider/emojiprovider";
import { Geolocation } from '@ionic-native/geolocation';

@NgModule({
  declarations: [
    ParsonalchatPage,
  ],
  imports: [
    IonicPageModule.forChild(ParsonalchatPage),
    EmojiPickerComponentModule
  ],
  exports: [
    ParsonalchatPage
  ],
  providers:[
    EmojiProvider,
    Geolocation
  ]
})
export class ParsonalchatPageModule {}
