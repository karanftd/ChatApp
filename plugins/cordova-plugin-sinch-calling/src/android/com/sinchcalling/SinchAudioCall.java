package com.sinchcalling;

import com.sinch.android.rtc.PushPair;
import com.sinch.android.rtc.calling.Call;
import com.sinch.android.rtc.calling.CallClient;
import com.sinch.android.rtc.calling.CallClientListener;
import com.sinch.android.rtc.calling.CallListener;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import android.util.Log;

/**
 * Created by parita.detroja on 5/12/17.
 * Contains all required method for audio call handling.
 */

public class SinchAudioCall {

    private String TAG = "SinchAudioCall";

    private CallClient callClient;

    private Call call = null;

    private CallbackContext audioCallCallbackContext = null;

    private PluginResult result = null;

    public SinchAudioCall()
    {
        callClient = ConfigureSinch.retrieveSinchClient().getCallClient();
    }

    public void createAudioCall(String remoteUsedId, CallbackContext callbackContext)
    {
        Log.d(TAG, "createAudioCall");
        if (call == null) {
            call = callClient.callUser(remoteUsedId);
            call.addCallListener(new SinchCallListener());
            this.audioCallCallbackContext = callbackContext;
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
            sendPluginResult("onCallEnded");
        }

        @Override
        public void onCallEstablished(Call establishedCall)
        {
            sendPluginResult("onCallEstablished");
        }

        @Override
        public void onCallProgressing(Call progressingCall)
        {
            sendPluginResult("onCallProgressing");
        }

        @Override
        public void onShouldSendPushNotification(Call call, List<PushPair> pushPairs) 
        {
    
        }
    }

    private class SinchCallClientListener implements CallClientListener 
    {
        @Override
        public void onIncomingCall(CallClient callClient, Call incomingCall) 
        {
            call = incomingCall;
            call.answer();
            call.addCallListener(new SinchCallListener());
        }
    }

    private void sendPluginResult(String callStatus)
    {
        try
        {
            JSONObject status = new JSONObject();
            status.put("call_status", callStatus);
            result = new PluginResult(PluginResult.Status.OK, status);
            result.setKeepCallback(true);
            audioCallCallbackContext.sendPluginResult(result);
        } catch(JSONException e)
        {
            e.printStackTrace();
        }
    }
}
