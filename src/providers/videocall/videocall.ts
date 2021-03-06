import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';

declare var apiRTC: any;

/*
  Generated class for the VideocallProvider provider.
  Handle video calling utility.
*/
@Injectable()
export class VideocallProvider {

  session;
  webRTCClient;
  incomingCallId = 0;
  myCallId;
  status;
  calleeId;

  constructor(
    private nativeAudio: NativeAudio,
    private events: Events) {
      console.log("Video call", "Initialization");
      this.nativeAudio.preloadComplex('uniqueI1', 'assets/tone.mp3', 1, 1, 0).then((succ)=>{
        console.log("suu",succ)
      }, (err)=>{
        console.log("err",err)
      });
  }

  InitializeApiRTC() {
    console.log("Video call", "From InitializeApiRTC");
    //apiRTC initialization
    apiRTC.init({
      apiKey: "819abef1fde1c833e0601ec6dd4a8226",
      // apiCCId : "2",
      onReady: (e) => {
        this.sessionReadyHandler(e);
      }
    });
  }

  sessionReadyHandler(e) {
    this.myCallId = apiRTC.session.apiCCId;
    this.InitializeControls();
    this.AddEventListeners();
    this.InitializeWebRTCClient();
    this.events.publish('apiCCId generated', this.myCallId);
  }

  InitializeWebRTCClient() {
    this.webRTCClient = apiRTC.session.createWebRTCClient({
      status: "status" //Optionnal
    });
    /*    this.webRTCClient.setAllowMultipleCalls(true);
        this.webRTCClient.setVideoBandwidth(300);
        this.webRTCClient.setUserAcceptOnIncomingCall(true);*/
  }

  InitializeControls() {
    console.log("InitializeControls");
    this.events.publish('showCall', true);
    this.events.publish('showAnswer', false);
    this.events.publish('showHangup', false);
    this.events.publish('showReject', false);
  }

  InitializeControlsForIncomingCall() {
    console.log("InitializeControlsForIncomingCall");
    this.events.publish('showCall', false);
    this.events.publish('showAnswer', true);
    this.events.publish('showReject', true);
    this.events.publish('showHangup', true);
    this.nativeAudio.loop('uniqueI1').then((succ)=>{
      console.log("succ",succ)
    }, (err)=>{
      console.log("err",err)
    });

  }

  InitializeControlsForHangup() {
    console.log("InitializeControlsForHangup");
    this.events.publish('showCall', true);
    this.events.publish('showAnswer', false);
    this.events.publish('showReject', false);
    this.events.publish('showHangup', false);
  }

  UpdateControlsOnAnswer() {
    console.log("UpdateControlsOnAnswer");
    this.events.publish('showAnswer', false);
    this.events.publish('showReject', false);
    this.events.publish('showHangup', true);
    this.events.publish('showCall', false);
  }

  UpdateControlsOnReject() {
    console.log("UpdateControlsOnReject");
    this.events.publish('showAnswer', false);
    this.events.publish('showReject', false);
    this.events.publish('showHangup', false);
    this.events.publish('showCall', true);
  }

  RemoveMediaElements(callId) {
    this.webRTCClient.removeElementFromDiv('mini', 'miniElt-' + callId);
    this.webRTCClient.removeElementFromDiv('remote', 'remoteElt-' + callId);
  }

  AddStreamInDiv(stream, callType, divId, mediaEltId, style, muted) {
    let mediaElt = null;
    let divElement = null;

    if (callType === 'audio') {
      mediaElt = document.createElement("audio");
    } else {
      mediaElt = document.createElement("video");
    }

    mediaElt.id = mediaEltId;
    mediaElt.autoplay = true;
    mediaElt.muted = muted;
    mediaElt.style.width = style.width;
    mediaElt.style.height = style.height;

    divElement = document.getElementById(divId);
    divElement.appendChild(mediaElt);

    this.webRTCClient.attachMediaStream(mediaElt, stream);
  }

  AddEventListeners() {
    apiRTC.addEventListener("userMediaSuccess", (e) => {
      this.events.publish('showStatus', true);
      this.events.publish('showMyVideo', true);

      this.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "mini", 'miniElt-' + e.detail.callId, {
        width: "128px",
        height: "96px"
      }, true);

    });

    apiRTC.addEventListener("userMediaError", (e) => {
      this.InitializeControlsForHangup();

      this.status = this.status + "<br/> The following error has occurred <br/> " + e;
    });

    apiRTC.addEventListener("incomingCall", (e) => {
      this.incomingCallId = e.detail.callId;
      this.events.publish('Incoming call.', this.incomingCallId);
      this.InitializeControlsForIncomingCall();
    });

    apiRTC.addEventListener("hangup", (e) => {
      if (e.detail.lastEstablishedCall === true) {
        this.InitializeControlsForHangup();
      }
      this.status = this.status + "<br/> The call has been hunged up due to the following reasons <br/> " + e.detail.reason;
      this.RemoveMediaElements(e.detail.callId);
      this.events.publish('hangup');
    });

    apiRTC.addEventListener("remoteStreamAdded", (e) => {
      this.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "remote", 'remoteElt-' + e.detail.callId, {
        width: "300px",
        height: "225px"
      }, false);
    });

    apiRTC.addEventListener("webRTCClientCreated", (e) => {
      console.log("webRTC Client Created");
      this.webRTCClient.setAllowMultipleCalls(true);
      this.webRTCClient.setVideoBandwidth(300);
      this.webRTCClient.setUserAcceptOnIncomingCall(true);
    });

  }

  MakeCall(calleeId) {
    var callId = this.webRTCClient.call(calleeId);
    if (callId != null) {
      this.incomingCallId = callId;
      this.events.publish('showHangup', true);
    }
  }

  HangUp() {
    this.webRTCClient.hangUp(this.incomingCallId);
  }

  AnswerCall(incomingCallId) {
    this.webRTCClient.acceptCall(incomingCallId);
    this.nativeAudio.stop('uniqueI1').then(()=>{},()=>{});

    this.UpdateControlsOnAnswer();
  }

  RejectCall(incomingCallId) {
    this.webRTCClient.refuseCall(incomingCallId);
    this.UpdateControlsOnReject();
    this.RemoveMediaElements(incomingCallId);
  }

}
