import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetOnlinePage } from './set-online';
import { Geolocation } from '@ionic-native/geolocation';

@NgModule({
  declarations: [
    SetOnlinePage,
  ],
  imports: [
    IonicPageModule.forChild(SetOnlinePage),
  ],
  providers: [
    Geolocation,
  ],
})
export class SetOnlinePageModule {}
