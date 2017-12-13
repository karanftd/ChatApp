import { Injectable } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';

/*
  Generated class for the ActionSheetProvider provider.
  Chat action sheet handling.
*/
@Injectable()
export class ActionSheetProvider {

  constructor(
    private actionSheetController:ActionSheetController,
  ) {
  }

  /**
   * Generate action sheet for different things.
   */
  presentActionSheet() {
   let actionSheet = this.actionSheetController.create({
     buttons: [
       {
         text: 'Camera',
         icon: 'md-camera',
         handler: () => {
           console.log('Camera');
         }
       },
       {
         text: 'Gallery',
         icon: 'md-image',
         handler: () => {
           console.log('Gallery');
         }
       },
       {
         text: 'Location',
         icon: 'md-pin',
         handler: () => {
           console.log('Location');
         }
       },
       {
         text: 'Contact',
         icon: 'md-contact',
         handler: () => {
           console.log('Contact');
         }
       }
     ]
   });

   actionSheet.present();
 }

}
