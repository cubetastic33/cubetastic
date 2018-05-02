var finalTime;
var finalMinutes;
var finalSeconds;
var finalMs;

function timer(elem) {
  var time = 0;
  var interval;
  var offset;
  var minutes;
  var seconds;
  var milliseconds;

  function update() {
    if (this.isOn) {
      time += delta();
    }
    var formattedTime = timeFormatter(time);
    elem.textContent = formattedTime;
  }

  function delta() {
    var now = Date.now();
    var timePassed = now - offset;
    offset = now;
    return timePassed;
  }

  function timeFormatter(timeInMs) {
    var time = new Date(timeInMs);
    minutes = time.getMinutes();
    seconds = time.getSeconds();
    milliseconds = time.getMilliseconds();
    var seconds = time.getSeconds().toString();
    var milliseconds = time.getMilliseconds().toString();

    if (seconds.length < 2) {
      seconds = '0' + seconds;
    }
    while (milliseconds.length < 3) {
      milliseconds = '0' + milliseconds;
    }
    return minutes-30 + ':' + seconds + '.' + milliseconds;
  }

  this.isOn =  false;

  this.start = function () {
    if (!this.isOn) {
      interval = setInterval(update.bind(this), 1);
      offset = Date.now();
      this.isOn = true;
    }
  };
  this.freeze = function () {
    clearInterval(interval);
    interval = null;
  }
  this.stop = function () {
    if (this.isOn) {
      finalTime = timeFormatter(time);
      clearInterval(interval);
      interval = null;
      this.isOn = false;
    }
  };
  this.reset = function () {
    time = 0;
    update();
  };
}
