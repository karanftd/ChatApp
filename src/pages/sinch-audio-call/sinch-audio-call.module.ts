import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SinchAudioCallPage } from './sinch-audio-call';

@NgModule({
  declarations: [
    SinchAudioCallPage,
  ],
  imports: [
    IonicPageModule.forChild(SinchAudioCallPage),
  ],
})
export class SinchAudioCallPageModule {}
