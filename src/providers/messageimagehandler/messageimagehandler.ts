import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { LoghandlingProvider } from '../loghandling/loghandling';

import firebase from 'firebase';

/*
  Generated class for the MessageimagehandlerProvider provider.

  Handles image message handling for chats.
*/
@Injectable()
export class MessageimagehandlerProvider {

  private TAG: string = "MessageimagehandlerProvider";
  nativepath: any;
  firestore = firebase.storage();
  options: CameraOptions;

  constructor(
    private camera: Camera,
    private loghandlingProvider: LoghandlingProvider) {
      this.options = {
        quality: 100,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.NATIVE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }
  }

  /**
   * For uploading an image to firebase storage.
   * Called from - profilepic.ts
   * Inputs - None.
   * Outputs - The image url of the stored image.
   */
  uploadimage() {
    var promise = new Promise((resolve, reject) => {
      this.camera.getPicture(this.options).then((imageData) => {
        this.nativepath = imageData;
        this.loghandlingProvider.showLog(this.TAG, imageData);
        (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
          res.file((resFile) => {
            var reader = new FileReader();
            reader.readAsArrayBuffer(resFile);
            reader.onloadend = (evt: any) => {
              var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
              var imageStore = this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid);
              imageStore.put(imgBlob).then((res) => {
                resolve(res.downloadURL);
              }).catch((err) => {
                reject(err);
              })
            }
          })
        })
      }, (err) => {
        this.loghandlingProvider.showLog(this.TAG, JSON.stringify(err));
      });
    })
    return promise;
  }
 
  /**
   * Method upload message image to firebase and return image url.
   */
  imageMassegeUpload() {
    var promise = new Promise((resolve, reject) => {
      this.camera.getPicture(this.options).then((imageData) => {
        this.nativepath = imageData;
        this.loghandlingProvider.showLog(this.TAG, imageData);
        (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
          res.file((resFile) => {
            var reader = new FileReader();
            reader.readAsArrayBuffer(resFile);
            reader.onloadend = (evt: any) => {
              var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
              var uuid = this.guid();
              var imageStore = this.firestore.ref('/picmsgs').child(firebase.auth().currentUser.uid).child('picmsg' + uuid);
              imageStore.put(imgBlob).then((res) => {
                resolve(res.downloadURL);
              }).catch((err) => {
                reject(err);
              })
            }
          })
        })
      }, (err) => {
        this.loghandlingProvider.showLog(this.TAG, JSON.stringify(err));
      });
    })    
     return promise;   
  }
 
 /**
  * Generate uuid for image unique identification. 
  */
  guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
 
}
