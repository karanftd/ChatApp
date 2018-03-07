import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

import { SinchConfig, SinchCalling } from 'sinch-call'

import { LoghandlingProvider } from '../loghandling/loghandling';

/*
  Generated class for the SinchCallingProvider provider.

  Sinch Calling plugin integration with different pages for audio and video calling.
*/
@Injectable()
export class SinchCallingProvider {

  private TAG: string = "SinchCallingProvider";

  constructor(
    private sinchCalling : SinchCalling,
    private loghandlingProvider: LoghandlingProvider, ) {
    
  }


  initSinch(){
    let sinchConfig: SinchConfig = this.getSinchConfig();

    this.loghandlingProvider.showLog(this.TAG, "from init sinch");
    this.loghandlingProvider.showLog(this.TAG, JSON.stringify(sinchConfig));
    return new Promise( (resolve, reject) => {
      this.sinchCalling.initSinch(sinchConfig).then((res) => {
        this.loghandlingProvider.showLog(this.TAG, "Sinch initialization responce : " + res);
        resolve(res);
      }, (err) => {
        this.loghandlingProvider.showLog(this.TAG, "Sinch initialization error : " + err);
        reject(err);
      });
    });

  }

  private getSinchConfig(){
    return {
      application_key: '3ab0522a-68aa-4696-848d-159ed6573f90',
      application_secret: '/L4vL23tGkKNvCFzlxkBxw==',
      environment_host: 'clientapi.sinch.com',
      user_id: firebase.auth().currentUser.uid
    };
  }

  createAudioCall(remoteUserId: string){
    this.loghandlingProvider.showLog(this.TAG, "createAudioCall");
    this.loghandlingProvider.showLog(this.TAG, "remote user id : " + JSON.stringify(remoteUserId));
    return new Promise( (resolve, reject) => {
      this.sinchCalling.connectAudioCall(remoteUserId).then((res) => {
        this.loghandlingProvider.showLog(this.TAG, "createAudioCall responce : " + res);
        resolve(res);
      }, (err) => {
        this.loghandlingProvider.showLog(this.TAG, "createAudioCall error : " + err);
        reject(err);
      });
    });
  }

}
