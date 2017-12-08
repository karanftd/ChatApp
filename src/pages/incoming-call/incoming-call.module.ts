import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IncomingCallPage } from './incoming-call';

@NgModule({
  declarations: [
    IncomingCallPage,
  ],
  imports: [
    IonicPageModule.forChild(IncomingCallPage),
  ],
})
export class IncomingCallPageModule {}
