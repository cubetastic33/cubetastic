var watch = new timer(document.getElementById('timer'));
var toggleBtn = document.getElementById('toggle');
var done = false;
var running = false;
var greened = false;
var x = true;
var stage = 0;
var timerId1 = null;
var timerId2 = null;
var num = 0;

function doBlink(cancel) {
  stage = 2;
  if (cancel == 0) {
    timerId2 = setInterval(function() {
      if (num === 0) {
        $('#red').attr('class', 'red');
        $('#green').attr('class', 'green');
        num = 1;
      }
      else {
        $('#red').attr('class', 'red');
        $('#green').attr('class', 'black');
        num = 0;
      }
    }, 200);
  }
  if (cancel != 0) {
    clearInterval(timerId2);
    $('#red').attr('class', 'black');
    $('#green').attr('class', 'black');
  }
}

function setupGreen() {
  timerId1 = setTimeout(function() {
    if (stage === 1) {
      $('#green').attr('class', 'green');
      greened = true;
    }
  }, 700);
}

function reset() {
  stage = 0;
  x = true;
  $('#red').attr('class', 'black');
  $('#green').attr('class', 'black');
  if (timerId1) {
    clearTimeout(timerId1);
    timerId1 = null;
  }
  if (timerId2) {
    clearTimeout(timerId2);
    timerId2 = null;
  }
}
function spacebar() {
  window.onkeydown = function(e) {
    if ((watch.isOn) && (!done)) {
      watch.freeze();
      doBlink(1);
    }
    if (e.keyCode == 32) {
      e.preventDefault();
      if (done) {
        watch.reset();
        done = false;
        stage = 1;
        $('#red').attr('class', 'red');
        setupGreen();
      }
      if (stage === 0) {
        stage = 1;
        $('#red').attr('class', 'red');
        setupGreen();
      }
    }
  }

  window.onkeyup = function(e) {
    if (greened == false) {
      x = false;
      reset();
    }
    else if ((greened == true) && (x == true)) {
      f1();
      if (stage === 1) {
        reset();
      }
    }
  }
}

spacebar();
var insert;
function f1() {
  if ((!watch.isOn) && (!done)) {
    watch.start();
    $('#oldScramble').text($('#scramble').text());
    doBlink(0);
    toggleBtn.textContent = "stop";
    $('#loginMessage').hide();
    $('#scramble').text('');
  }
  else if ((watch.isOn) && (!done)) {
    watch.stop();
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        saveTime(finalTime);
      }
    });
    var solvedTime = $('#timer').html;
    done = true;
    doBlink(1);
    greened = false;
    toggleBtn.textContent = "start";
    showScramble($('#cubeTypeSelect').val());
  }
  else if ((!watch.isOn) && (done)) {
    watch.reset();
    done = false;
    f1();
  }
}

function f2() {
  if ((watch.isOn) && (!done)) {
    watch.stop();
    done = false;
    doBlink(1);
    greened = false;
    toggleBtn.textContent = "start";
  }
  watch.reset();
}
