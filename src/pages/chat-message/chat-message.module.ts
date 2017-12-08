import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatMessagePage } from './chat-message';
import { EmojiPickerComponentModule } from "../../components/emoji-picker/emoji-picker.module";
import { EmojiProvider } from "../../providers/emojiprovider/emojiprovider";

@NgModule({
  declarations: [
    ChatMessagePage
  ],
  imports: [
    IonicPageModule.forChild(ChatMessagePage),
    EmojiPickerComponentModule
  ],
  exports: [
    ChatMessagePage
  ],
  providers:[
    EmojiProvider
  ]
})
export class ChatMessagePageModule {}
