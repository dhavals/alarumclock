// object definitions

function Alarm(alarmTime, alarmTone, alarmState) {
    this.alarmTime = alarmTime; // Date object
    this.alarmTone = alarmTone || 'default';
    this.alarmState = alarmState || true; // default alarm state to on
}

// prototype methods for builtin objects

// yymmdd1:hh1:mm1:ss1 <=> yymmdd2:hh2:mm2:ss2 ?
// ignore milliseconds for sake of comparison
Date.prototype.compareTo = function(that) {
    if (!(that instanceof Date)) {
        throw new Error("Can't compare a Date with a non-Date object " + that);
    }
    var thisTemp = new Date(this.getFullYear(), this.getMonth(), this.getDate(),
        this.getHours(), this.getMinutes(), this.getSeconds(), 0);
    var thatTemp = new Date(that.getFullYear(), that.getMonth(), that.getDate(),
        that.getHours(), that.getMinutes(), that.getSeconds(), 0);

    return thisTemp.getTime() - thatTemp.getTime();
};

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};


$(document).ready(function() {

    var appState;
    var alarmSetForm;
    var alarmNotificationDiv;
    var currentTimeDiv;
    var updateScreenTimeId;
    var updateStateId;
    var alarmSetButton;

    initApp();

    function initApp() {
        // global app state object initialization
        appState = {
            currentTime: new Date(),
            alarms: []
        };

        // caching jquery selectors
        currentTimeDiv = $('#currentTime');
        alarmNotificationDiv = $('#alarmNotification');
        alarmSetForm = $('#alarmSetter');
        alarmSetButton = $('#alarmSetButton');

        // attach event listeners
        alarmSetButton.on('click', onAlarmSet);

        // populate the dom
        populateAlarmSetter();
        updateScreenTime();

        // schedule updates to app state and screen state
        updateStateId = setInterval(updateState, 1000);
        updateScreenTimeId = setInterval(updateScreenTime, 1000);
    }


    /****************************************************************************************/
        // event handlers go here

        // parsing here is subject to change, because UI elements will probably change
    function onAlarmSet(event) {
        var currentMoment = new Date();

        // assume same date to begin with, but increment if alarm is set for a time already 'past'
        var hours = parseInt($('#hourSet').find(':selected').text());
        var minutes = parseInt($('#minuteSet').find(':selected').text());
        var seconds = 0; // ignoring seconds for now, probably forever

        var alarmMoment = new Date();
        alarmMoment.setHours(hours, minutes, seconds, 0);

        // if the alarm is set for a time already past today (you can set alarms at most 24 hours into the future)
        if (currentMoment.compareTo(alarmMoment) > 0) {
            alarmMoment.setDate(alarmMoment.getDate() + 1);
        }

        var alarmObject = new Alarm(alarmMoment, 'default', true);
        appState.alarms.push(alarmObject);
        console.dir(appState.alarms);

        return false;
    }


    /****************************************************************************************/

    function populateAlarmSetter() {
        var hourSetSelect = $('#hourSet');
        var minuteSetSelect = $('#minuteSet');

        for (var i = 0; i < 60; i++) {
            var iString = (i < 10) ? '0' + i : i + '';
            if (i < 24) {
                $('<option></option>', {
                    value: i,
                    text: iString
                }).appendTo(hourSetSelect);
            }

            $('<option></option>', {
                value: i,
                text: iString
            }).appendTo(minuteSetSelect);
        }
    }

    // called every second
    // loop through alarms array to see if any alarms need handling
    function checkAlarms() {
        for (var i = 0, len = appState.alarms.length; i < len; i++) {
            var alarm = appState.alarms[i];
            // if alarm is due
            if (appState.currentTime.compareTo(alarm.alarmTime) > 0) {
                // then ring it (or schedule it for ringing -- will need to add some mechanism here)
                console.log('alarm for ' + alarm.alarmTime + ' is ringing NOW!');

                // and delete the alarm, because we're done with it, right?
                // this will change, because we need to be able to snooze this alarm.

                len = appState.alarms.remove(i); // returns length of changed array, so update len
                i--; // to stay on the same index (which will point to the next element)
            }
        }
    }

    function updateState() {
        appState.currentTime = new Date();
        checkAlarms();
    }

    function updateScreenTime() {
        currentTimeDiv.text(appState.currentTime);
    }
});