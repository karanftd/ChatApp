
var exec = require('cordova/exec');

var PLUGIN_NAME = 'SinchCalling';

var sinchCalling = {

	initSinch: function(success, failure, config) {
        exec(success || emptyFnc,
            failure || emptyFnc,
            PLUGIN_NAME,
            'initSinch',
            [config]
        );
    },
    connectAudioCall: function(config, success, failure) {
        exec(success || emptyFnc,
            failure || emptyFnc,
            PLUGIN_NAME,
            'connectAudioCall',[config]);
    },
    hangupAudioCall: function(success, failure) {
        exec(success || emptyFnc,
            failure || emptyFnc,
            PLUGIN_NAME,
            'hangupAudioCall',[]);
    },
    answerAudioCall: function(config, suceess, failure) {
        exec(success || emptyFnc,
            failure || emptyFnc,
            PLUGIN_NAME,
            'answerAudioCall',[config]);
    },
};

module.exports = sinchCalling;
