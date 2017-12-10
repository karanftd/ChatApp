import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatMessagePage } from './chat-message';
import { AutoSizeDirective } from '../../directives/auto-size/auto-size';
import { EmojiPickerComponentModule } from "../../components/emoji-picker/emoji-picker.module";
import { EmojiProvider } from "../../providers/emojiprovider/emojiprovider";

@NgModule({
  declarations: [
    ChatMessagePage,
    AutoSizeDirective
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
