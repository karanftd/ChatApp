import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Events, } from 'ionic-angular';

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
    private loghandlingProvider: LoghandlingProvider,
    private events: Events,) {
    
  }


  initSinch(){
    let sinchConfig: SinchConfig = this.getSinchConfig();

    this.loghandlingProvider.showLog(this.TAG, "from init sinch");
    this.loghandlingProvider.showLog(this.TAG, JSON.stringify(sinchConfig));
    return new Promise( (resolve, reject) => {
      this.loghandlingProvider.showLog(this.TAG, "from init sinch promise");
      this.sinchCalling.initSinch(sinchConfig).subscribe((res) => {
        this.loghandlingProvider.showLog(this.TAG, "Sinch initialization responce ::::: " + JSON.stringify(res));
        if(res.call_status)
        {
          this.loghandlingProvider.showLog(this.TAG, "subscribe " + res.call_status);
          this.events.publish(res.call_status);
        }
        resolve(res);
      }, (err) => {
        this.loghandlingProvider.showLog(this.TAG, "Sinch initialization error ::::: " + JSON.stringify(err));
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

  hangupAudioCall(){
    this.loghandlingProvider.showLog(this.TAG, "hangupAudioCall");
    return new Promise( (resolve, reject) => {
      this.sinchCalling.hangupAudioCall().then((res) => {
        this.loghandlingProvider.showLog(this.TAG, "hangupAudioCall responce : " + res);
        resolve(res);
      }, (err) => {
        this.loghandlingProvider.showLog(this.TAG, "hangupAudioCall error : " + err);
        reject(err);
      });
    });
  }

  answerAudioCall(answer_state: boolean){
    this.loghandlingProvider.showLog(this.TAG, "answerAudioCall");
    return new Promise( (resolve, reject) => {
      this.sinchCalling.answerAudioCall(answer_state).then((res) => {
        this.loghandlingProvider.showLog(this.TAG, "answerAudioCall responce : " + res);
        resolve(res);
      }, (err) => {
        this.loghandlingProvider.showLog(this.TAG, "answerAudioCall error : " + err);
        reject(err);
      });
    });
  }

}
