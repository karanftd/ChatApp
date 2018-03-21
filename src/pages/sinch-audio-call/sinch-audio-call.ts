import { Component } from '@angular/core';
import { IonicPage, Events, NavParams, NavController } from 'ionic-angular';

import { LoghandlingProvider } from '../../providers/loghandling/loghandling';
import { SinchCallingProvider } from '../../providers/sinch-calling/sinch-calling';

/**
 * Generated class for the SinchAudioCallPage page.
 *
 * Audio call page using sinch calling plugin.
 */

@IonicPage()
@Component({
  selector: 'page-sinch-audio-call',
  templateUrl: 'sinch-audio-call.html',
})
export class SinchAudioCallPage {

  private TAG = "SinchAudioCallPage";
  private callType: string;
  private showHangup: boolean;
  private showAnswer: boolean;
  private showStatus: boolean;
  private incomingCallId: string; 
  
  constructor(
    private events: Events,
    private navParams: NavParams,
    private navController: NavController,
    private loghandlingProvider: LoghandlingProvider,
    private sinchCallingProvider: SinchCallingProvider,) {
      
      this.events.subscribe('onCallEnded', () => {
        this.loghandlingProvider.showLog(this.TAG, "subscribe onCallEnded");
        this.closeAudioCallPage();
        this.showStatus = true;
        this.showHangup = false;
        this.showAnswer = false;
      });

      this.events.subscribe('onCallEstablished', () => {
        this.loghandlingProvider.showLog(this.TAG, "subscribe onCallEstablished");
        this.showStatus = true;
        this.showHangup = true;
        this.showAnswer = false;
      });

      this.events.subscribe('onCallProgressing', () => {
        this.loghandlingProvider.showLog(this.TAG, "subscribe onCallProgressing");
        this.showStatus = true;
        this.showHangup = true;
        this.showAnswer = false;
      });

    this.callType = this.navParams.get('call_type');

    if(this.callType == "onIncomingCall")
    {
      this.showStatus = true;
      this.showHangup = true;
      this.showAnswer = true;
    }else{
      this.showStatus = true;
      this.showHangup = true;
      this.showAnswer = false;
    }
  }

  AnswerCall(answerStatus:boolean){
    this.loghandlingProvider.showLog(this.TAG,"from answer call");
    this.sinchCallingProvider.answerAudioCall(answerStatus).then((res: any) => {
      this.loghandlingProvider.showLog(this.TAG, "answerAudioCall responce : " + JSON.stringify(res));
    }).catch((err) => {
      this.loghandlingProvider.showLog(this.TAG, "answerAudioCall error : " + err);
    });
  }

  HangUp(){
    this.sinchCallingProvider.hangupAudioCall().then((res: any) => {
      this.loghandlingProvider.showLog(this.TAG, "hangupAudioCall responce : " + JSON.stringify(res));
      this.closeAudioCallPage();
    }).catch((err) => {
      this.loghandlingProvider.showLog(this.TAG, "hangupAudioCall error : " + err);
    });
  }

  closeAudioCallPage(){
    if(this.navController.getActive().name == "SinchAudioCallPage"){
        this.navController.pop();
    }
  }

}
