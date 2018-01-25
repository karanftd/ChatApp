import { Component } from '@angular/core';
import { IonicPage, Events, NavParams, NavController } from 'ionic-angular';

import { LoghandlingProvider } from '../../providers/loghandling/loghandling';
import { VideocallProvider } from '../../providers/videocall/videocall';

/**
 * Generated class for the IncomingCallPage page.
 * Incoming call handling.
 */

@IonicPage()
@Component({
  selector: 'page-incoming-call',
  templateUrl: 'incoming-call.html',
})
export class IncomingCallPage {

  showCall: boolean;
  showHangup: boolean;
  showAnswer: boolean;
  showReject: boolean;
  showStatus: boolean;
  showRemoteVideo: boolean = true;
  showMyVideo: boolean = true;
  incomingCallId = 0;

  private TAG = "IncomingCallPage";

  constructor(
    private events: Events,
    private loghandlingProvider: LoghandlingProvider,
    private navParams: NavParams,
    private videocallProvider: VideocallProvider,
    private navController: NavController,
  ) {
    
    if(this.navParams.get('status') == "incoming"){
      this.incomingCallId = this.navParams.get('incomingCallId');
      this.showCall = false;
      this.showAnswer = true;
      this.showReject = true;
      this.showHangup = true;
    }

     this.events.subscribe('showCall', (showCall) => {
       this.loghandlingProvider.showLog(this.TAG, "showCall subscribe " + showCall);
       this.showCall = showCall;
     });

     this.events.subscribe('showHangup', (showHangup) => {
       this.loghandlingProvider.showLog(this.TAG, "showHangup subscribe " + showHangup);
       this.showHangup = showHangup;
     });

     this.events.subscribe('showAnswer', (showAnswer) => {
       this.loghandlingProvider.showLog(this.TAG, "showAnswer subscribe " + showAnswer);
       this.showAnswer = showAnswer;
     });

     this.events.subscribe('showReject', (showReject) => {
       this.loghandlingProvider.showLog(this.TAG, "showReject subscribe " + showReject);
       this.showReject = showReject;
     });

     this.events.subscribe('showStatus', (showStatus) => {
       this.loghandlingProvider.showLog(this.TAG, "showStatus subscribe " + showStatus);
       this.showStatus = showStatus;
     });

     this.events.subscribe('showRemoteVideo', (showRemoteVideo) => {
       this.loghandlingProvider.showLog(this.TAG, "showRemoteVideo subscribe " + showRemoteVideo);
       this.showRemoteVideo = showRemoteVideo;
     });

     this.events.subscribe('showMyVideo', (showMyVideo) => {
       this.loghandlingProvider.showLog(this.TAG, "showMyVideo subscribe " + showMyVideo);
       this.showMyVideo = showMyVideo;
     });

     this.events.subscribe('hangup',() => {
           this.navController.pop();
     });
  }

  AnswerCall(){
    this.loghandlingProvider.showLog(this.TAG, "Answer call : " + this.incomingCallId);
    this.videocallProvider.AnswerCall(this.incomingCallId);
  }

  HangUp(){
    this.loghandlingProvider.showLog(this.TAG, "HangUp");
    this.videocallProvider.HangUp();
  }
}