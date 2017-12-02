import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OneTwoOnePage } from './one-two-one';
import { EmojiPickerComponentModule } from "../../components/emoji-picker/emoji-picker.module";
import { EmojiProvider } from "../../providers/emojiprovider/emojiprovider";

@NgModule({
  declarations: [
    OneTwoOnePage,
  ],
  imports: [
    IonicPageModule.forChild(OneTwoOnePage),
     EmojiPickerComponentModule
  ],
  exports: [
    OneTwoOnePage
  ],
  providers:[
    EmojiProvider
  ]
})
export class OneTwoOnePageModule {}
