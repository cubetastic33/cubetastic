firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    messaging.requestPermission()
    .then(function() {
      console.log('Notification permission granted.');
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
    messaging.getToken()
    .then(function(currentToken) {
      console.log(currentToken);
      db.ref('fcmTokens').child(currentToken).set(firebase.auth().currentUser.uid);
    })
    .catch(function(err) {
      console.log('An error occurred while retrieving token. ', err);
    });
    messaging.onTokenRefresh(function() {
      messaging.getToken()
      .then(function(refreshedToken) {
        console.log(refreshedToken);
        db.ref('fcmTokens').child(currentToken).set(firebase.auth().currentUser.uid);
      })
      .catch(function(err) {
        console.log('Unable to retrieve refreshed token ', err);
      });
    });
  }
});

var chatIFrame = document.getElementById('chatIFrame');

function updateTimerContent() {
  if (chatIFrame.contentWindow.groupOpen === false) {
    $('#collabicubePanel').html('<p class="flow-text">Select a group to get started.</p>');
  } else if (chatIFrame.contentWindow.groupOpen !== undefined) {
    $('#collabicubePanel').html('\
      <div id="scramble">Generating Scramble...</div>\
      <div id="scrambleImage"></div>\
    ');
    showScramble(category[selectedCategory]);
  }
}

//Timer code

var stopped = false;
var timerRunning = false;
var timerStartTime = 0;
var startDelayTimer = false;

var entireTimerDiv = document.getElementById('timer');
var el = document.getElementById('time');
el.addEventListener("touchstart", handleStart, false);
el.addEventListener("touchend", handleEnd, false);
entireTimerDiv.addEventListener("touchstart", handleFullStart, false);
entireTimerDiv.addEventListener("touchend", handleFullEnd, false);

$(window).keydown(function(e) {
  if (timerRunning == true) {
    //Stop the timer
    clearInterval(startedTimer);
    stopped = true;
    timerRunning = false;
    clearInterval(startedBlinking);
  }
  if (e.keyCode == 32) {
    //This will fire every time the user presses the spacebar
    e.preventDefault();
    //This is so that the page doesn't scroll
    if ((timerRunning == false) && (stopped == false)) {
      //Start the timer
      $('#red').attr('class', 'red');
      if (startDelayTimer == false) {
        var d = new Date();
        startDelayTimer = d.getTime();
      } else {
        var date = new Date();
        if (date.getTime() - startDelayTimer >= 700) {
          $('#green').attr('class', 'green');
        }
      }
    }
  }
});

function handleFullStart(e) {
  if (timerRunning == true) {
    //Stop the timer
    clearInterval(startedTimer);
    stopped = true;
    timerRunning = false;
    clearInterval(startedBlinking);
  }
}

function handleStart(e) {
  e.preventDefault();
  if ((timerRunning == false) && (stopped == false)) {
    //Start the timer
    $('#red').attr('class', 'red');
    if (startDelayTimer == false) {
      var d = new Date();
      startDelayTimer = d.getTime();
      window.showGreenTimeout = setTimeout(showGreen, 700);
    }
  }
}

function showGreen() {
  if (startDelayTimer != false) {
    $('#green').attr('class', 'green');
  }
}

$(window).keyup(function(e) {
  if (e.keyCode == 32) {
    //Spacebar is pressed
    e.preventDefault();
    startDelayTimer = false;
    if ((stopped == false) && ($('#green').hasClass('green') == true)) {
      var date = new Date();
      timerStartTime = date.getTime().toString();
      window.startedTimer = setInterval(timer, 10);
      $('#red').attr('class', '');
      $('#green').attr('class', '');
      window.startedBlinking = setInterval(blink, 200);
      $('#scramble').html('');
      if ($('#hideelements').prop('checked') == true) {
        $('#records, #session, #selectSession, #selectCategory, #editTimeBtn, #scrambleImage, .fixed-action-btn').hide();
      }
    } else {
      if ($('#hideelements').prop('checked') == true) {
        $('#records, #session, #selectSession, #selectCategory, #editTimeBtn, #scrambleImage, .fixed-action-btn').show();
      }
      $('#red').attr('class', '');
      $('#green').attr('class', '');
      if (stopped == true) {
        showScramble(category[selectedCategory]);
      }
      stopped = false;
    }
  } else {
    if ($('#hideelements').prop('checked') == true) {
      $('#records, #session, #selectSession, #selectCategory, #editTimeBtn, #scrambleImage, .fixed-action-btn').show();
    }
    $('#red').attr('class', '');
    $('#green').attr('class', '');
    if (stopped == true) {
      showScramble(category[selectedCategory]);
    }
    stopped = false;
  }
});

function handleFullEnd(e) {
  if ($('#hideelements').prop('checked') == true) {
    $('#records, #session, #selectSession, #selectCategory, #editTimeBtn, #scrambleImage, .fixed-action-btn').show();
  }
  $('#red').attr('class', '');
  $('#green').attr('class', '');
  if (stopped == true) {
    showScramble(category[selectedCategory]);
  }
  stopped = false;
}

function handleEnd(e) {
  startDelayTimer = false;
  clearTimeout(showGreenTimeout);
  if ((stopped == false) && ($('#green').hasClass('green') == true)) {
    var date = new Date();
    timerStartTime = date.getTime().toString();
    window.startedTimer = setInterval(timer, 10);
    $('#red').attr('class', '');
    $('#green').attr('class', '');
    window.startedBlinking = setInterval(blink, 200);
    $('#scramble').html('');
    if ($('#hideelements').prop('checked') == true) {
      $('#records, #session, #selectSession, #selectCategory, #editTimeBtn, #scrambleImage, .fixed-action-btn').hide();
    }
  } else {
    if ($('#hideelements').prop('checked') == true) {
      $('#records, #session, #selectSession, #selectCategory, #editTimeBtn, #scrambleImage, .fixed-action-btn').show();
    }
    $('#red').attr('class', '');
    $('#green').attr('class', '');
    if (stopped == true) {
      showScramble(category[selectedCategory]);
    }
    stopped = false;
  }
}

function blink() {
  if ($('#green').hasClass('green') == false) {
    $('#red').addClass('red');
    $('#green').addClass('green');
  } else {
    $('#red').removeClass('red');
    $('#green').removeClass('green');
  }
}

function printTime(minutes, seconds, milliseconds) {
  $('#time h1').html(minutes + ':' + seconds + '.' + milliseconds);
}

function timer() {
  if (stopped == false) {
    timerRunning = true;
    var d = new Date();
    var minutes = parseInt((d.getTime() - timerStartTime)/60000);
    var seconds = '00' + (parseInt(((d.getTime() - timerStartTime)%60000)/1000)).toString();
    seconds = seconds.substr((seconds.length - 2), (seconds.length));
    var milliseconds = '000' + ((d.getTime() - timerStartTime)%1000).toString();
    milliseconds = milliseconds.substr((milliseconds.length - 3), (milliseconds.length));
    window.lastTime = minutes + ':' + seconds + '.' + milliseconds.substr(0, 3);
    printTime(minutes, seconds, milliseconds.substr(0, 3));
  }
}

//Other code

var selectedCategory = localStorage.getItem('selectedCategory');
var category = {'3x3x3': '333', '2x2x2': '222', '3x3x3 bld': '333ni', 'Pyraminx': 'pyram', '4x4x4': '444', '5x5x5': '555', '6x6x6': '666', '7x7x7': '777', 'Megaminx': 'minx', 'Skewb': 'skewb', 'Square 1': 'sq1fast'}

if (selectedCategory == null) {
  localStorage.setItem('selectedCategory', '3x3x3');
  selectedCategory = '3x3x3';
}

$('#selectCategory').text(selectedCategory);

$('#selectCategoryDropdown li a').click(function(e) {
  e.preventDefault();
  localStorage.setItem('selectedCategory', $(this).text());
  selectedCategory = $(this).text();
  $('#selectCategory').text(selectedCategory);
  showScramble(category[selectedCategory]);
});

function puzzlesLoaded(puzzles) {
  window.puzzles = puzzles;
}

function showScramble(type) {
  $('#scramble').text('Scramble: ');
  var puzzle = puzzles[type];
  var generatedScramble = puzzle.generateScramble();
  $('#scramble').append(generatedScramble);
  $('#scrambleOutsidePanel').append(generatedScramble);
  //Display scramble image
  $('#scrambleImage').html(tnoodlejs.scrambleToSvg(generatedScramble, puzzle, 0, 0));
}

//Settings

//Themes
var graywisp = ['#E3F2FD', '#263238', '#B0BEC5', '#CFD8DC', '#B0BEC5', false];
var dark = ['#212121', '#FFFFFF', '#000000', '#000000', '#000000', true];
var chlorisgray = ['#212121', '#00e676', '#212121', '#212121', '#e6ee9c', false];
var transparent = ['#FFFFFF', '#000000', '#00000000', '#00000000', '#00000000', false];

var allThemes = {'Gray Wisp': graywisp, 'Dark': dark, 'Chloris Gray': chlorisgray, 'Transparent': transparent};

if (localStorage.getItem('enableColorThemes') == null) {
  localStorage.setItem('enableColorThemes', true);
}
if (localStorage.getItem('enableCustomColors') == null) {
  localStorage.setItem('enableCustomColors', false);
}
if (localStorage.getItem('colortheme') == null) {
  localStorage.setItem('colortheme', 'Gray Wisp');
}
if (localStorage.getItem('font') == null) {
  localStorage.setItem('font', 'Play');
}
if (localStorage.getItem('showscrambleimage') == null) {
  localStorage.setItem('showscrambleimage', 'hide-on-small-only');
}
if (localStorage.getItem('hideelements') == null) {
  localStorage.setItem('hideelements', false);
}
if (localStorage.getItem('bgImage') == null) {
  localStorage.setItem('bgImage', 'None');
}
if (localStorage.getItem('bgcolor') == null) {
  localStorage.setItem('bgcolor', '#000000');
}
if (localStorage.getItem('textcolor') == null) {
  localStorage.setItem('textcolor', '#ffffff');
}
if (localStorage.getItem('recordsbgcolor') == null) {
  localStorage.setItem('recordsbgcolor', '#000000');
}
if (localStorage.getItem('sessionbgcolor') == null) {
  localStorage.setItem('sessionbgcolor', '#000000');
}
if (localStorage.getItem('scrambleimagebgcolor') == null) {
  localStorage.setItem('scrambleimagebgcolor', '#000000');
}
if (localStorage.getItem('replaceshadow') == null) {
  localStorage.setItem('replaceshadow', false);
}

var font = localStorage.getItem('font');
var showscrambleimage = localStorage.getItem('showscrambleimage');
var hideelements = $.parseJSON(localStorage.getItem('hideelements'));
var bgImage = localStorage.getItem('bgImage');
var enableColorThemes = $.parseJSON(localStorage.getItem('enableColorThemes'));
var enableCustomColors = $.parseJSON(localStorage.getItem('enableCustomColors'));
var colortheme = localStorage.getItem('colortheme');

if (enableColorThemes == true) {
  localStorage.setItem('bgcolor', allThemes[colortheme][0]);
  localStorage.setItem('textcolor', allThemes[colortheme][1]);
  localStorage.setItem('recordsbgcolor', allThemes[colortheme][2]);
  localStorage.setItem('sessionbgcolor', allThemes[colortheme][3]);
  localStorage.setItem('scrambleimagebgcolor', allThemes[colortheme][4]);
  localStorage.setItem('replaceshadow', allThemes[colortheme][5]);
}

var bgcolor = localStorage.getItem('bgcolor');
var textcolor = localStorage.getItem('textcolor');
var recordsbgcolor = localStorage.getItem('recordsbgcolor');
var sessionbgcolor = localStorage.getItem('sessionbgcolor');
var scrambleimagebgcolor = localStorage.getItem('scrambleimagebgcolor');
var replaceshadow = $.parseJSON(localStorage.getItem('replaceshadow'));

//Apply settings

$('#time h1').css('font-family', font);
$('#scrambleImage').attr('class', showscrambleimage);
$('#timer').css({
  'background-color': bgcolor,
  'color': textcolor
});
$('.outlined-btn').css({
  'border-color': textcolor,
  'color': textcolor
});
$('.outlined-btn').hover(function(e) {
  $(this).css('background-color', e.type === 'mouseenter'?textcolor:'#00000000');
  $(this).css('color', e.type === 'mouseenter'?'white':textcolor);
});
$('#records').css('background-color', recordsbgcolor);
$('#session').css('background-color', sessionbgcolor);
$('#scrambleImage').css('background-color', scrambleimagebgcolor);
if (replaceshadow == true) {
  $('#records, #session, tr').css('border', '1px solid white');
  $('#records, tr').removeClass('z-depth-1');
} else {
  $('#records, #session, tr').css('border', '');
  $('#records, tr').addClass('z-depth-1');
}

if (bgImage != 'None') {
  $('#timer').css('background-image', 'url('+ bgImage +')');
} else {
  $('#timer').css('background-image', '');
}
