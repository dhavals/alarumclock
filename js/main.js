$(document).ready(function () {

    Date.prototype.timeNow = function () {
        return ((this.getHours() < 10) ? "0" : "") + ((this.getHours() > 12) ? (this.getHours() - 12) : this.getHours()) + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds() + ((this.getHours() > 12) ? (' PM') : ' AM');
    };

    var currentTimeDiv = $('#currentTime');

    function updateCurrentTime() {
        currentTimeDiv.text((new Date).timeNow());
    }

    var updateCurrentTimeId = setInterval(updateCurrentTime, 1000);

});