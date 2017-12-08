import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavContactPage } from './fav-contact';

@NgModule({
  declarations: [
    FavContactPage,
  ],
  imports: [
    IonicPageModule.forChild(FavContactPage),
  ],
})
export class FavContactPageModule {}
