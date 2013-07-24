$(document).ready(function () {

    var appState = {
        currentTime: new Date(),
        alarmTime: new Date((new Date()).getTime() + 5000), // alarm will ring in 5 seconds
        alarmState: true
    };

    Date.prototype.timeNow = function () {
        return ((this.getHours() < 10) ? "0" : "") + ((this.getHours() > 12) ? (this.getHours() - 12) : this.getHours()) + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds() + ((this.getHours() > 12) ? (' PM') : ' AM');
    };

    var updateStateId = setInterval(updateState, 1000);
    var updateScreenTimeId = setInterval(updateScreenTime, 1000);

    var currentTimeDiv = $('#currentTime');
    var alarmNotificationDiv = $('#alarmNotification');

    function updateState() {
        appState.currentTime = new Date();
    }

    function updateScreenTime() {
        currentTimeDiv.text(appState.currentTime.timeNow());
        if ((appState.currentTime > appState.alarmTime) && appState.alarmState) {
            appState.alarmState = false;
            alarmNotificationDiv.text("ALARM!");
            console.log("ring!!!");
        }
    }
});