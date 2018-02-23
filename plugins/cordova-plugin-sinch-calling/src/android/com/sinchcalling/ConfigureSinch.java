package com.sinchcalling;

import android.content.Context;

import com.sinch.android.rtc.Sinch;
import com.sinch.android.rtc.SinchClient;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by parita.detroja on 5/12/17.
 * Initiate sinch-client for different sinch functionality.
 */

public class ConfigureSinch
{
    private static SinchClient sinchClient; //sinch client

    public static SinchClient retrieveSinchClient()
    {
        return sinchClient;
    }

    /**
     * Build sinch client for audio and video calling by providing all keys and user id etc.
     * @param context activity context for sinch client
     * @param configurationData all required keys in JSONObject
     */
    public static JSONObject initiateSinchClient(Context context, JSONObject configurationData)
    {
        JSONObject returnStatus = new JSONObject();

        boolean state = false;
        
        try {
             sinchClient = Sinch.getSinchClientBuilder().context(context)
                    .applicationKey(configurationData.getString(Constant.APPLICATION_KEY))
                    .applicationSecret(configurationData.getString(Constant.APPLICATION_SECRET))
                    .environmentHost(configurationData.getString(Constant.ENVIRONMENT_HOST))
                    .userId(configurationData.getString(Constant.USER_ID))
                    .build();
                    
            state = true;

            returnStatus.put("status", state);
            returnStatus.put("sinch_initiation_state","Sinch initialization successfull");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        
        return returnStatus;
    }

    public static void setSupportMessaging(boolean status)
    {
        sinchClient.setSupportMessaging(status);
    }

    public static void setSupportCalling(boolean status)
    {
        sinchClient.setSupportCalling(status);
    }

    public static void setSupportManagedPush(boolean status)
    {
        sinchClient.setSupportManagedPush(status);
    }

    public static void setSupportActiveConnectionInBackground(boolean status)
    {
        sinchClient.setSupportActiveConnectionInBackground(status);
    }

    public static void startListeningOnActiveConnection()
    {
        sinchClient.startListeningOnActiveConnection();
    }

    public static void startSinchClient()
    {
        sinchClient.start();
    }

    public static void stopListeningOnActiveConnection()
    {
        sinchClient.stopListeningOnActiveConnection();
    }

    public static void terminateSinchClient()
    {
        sinchClient.terminate();
    }

}