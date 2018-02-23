package com.sinchcalling;

import com.sinch.android.rtc.PushPair;
import com.sinch.android.rtc.calling.Call;
import com.sinch.android.rtc.calling.CallClient;
import com.sinch.android.rtc.calling.CallClientListener;
import com.sinch.android.rtc.calling.CallListener;

import java.util.List;

/**
 * Created by parita.detroja on 5/12/17.
 * Contains all required method for audio call handling.
 */

public class SinchAudioCall {

    private CallClient callClient;

    private Call call;

    public SinchAudioCall()
    {
        callClient = ConfigureSinch.retrieveSinchClient().getCallClient();
    }

    public void createAudioCall(String remoteUsedId)
    {
        if (call == null) {
            call = callClient.callUser(remoteUsedId);
            call.addCallListener(new SinchCallListener());
        }
    }

    public void hangUpAudioCall()
    {
        if(call != null)
        {
            call.hangup();
        }
    }

    public void addCallClientListener()
    {
        callClient.addCallClientListener(new SinchCallClientListener());
    }

    private class SinchCallListener implements CallListener
    {
        @Override
        public void onCallEnded(Call endedCall)
        {
            call = null;
        }

        @Override
        public void onCallEstablished(Call establishedCall)
        {

        }

        @Override
        public void onCallProgressing(Call progressingCall)
        {

        }

        @Override
        public void onShouldSendPushNotification(Call call, List<PushPair> pushPairs) {}
    }

    private class SinchCallClientListener implements CallClientListener {
        @Override
        public void onIncomingCall(CallClient callClient, Call incomingCall) {
            call = incomingCall;
            call.answer();
            call.addCallListener(new SinchCallListener());
        }
    }
}
