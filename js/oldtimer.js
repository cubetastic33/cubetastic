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

var selectedSession = localStorage.getItem('selectedSession');
var selectedCategory = localStorage.getItem('selectedCategory');
var category = {'3x3x3': '333', '2x2x2': '222', '3x3x3 bld': '333ni', 'Pyraminx': 'pyram', '4x4x4': '444', '5x5x5': '555', '6x6x6': '666', '7x7x7': '777', 'Megaminx': 'minx', 'Skewb': 'skewb', 'Square 1': 'sq1fast'}

if (selectedSession == null) {
  localStorage.setItem('selectedSession', 'session 1');
  selectedSession = 'session 1';
}
if (selectedCategory == null) {
  localStorage.setItem('selectedCategory', '3x3x3');
  selectedCategory = '3x3x3';
}

$('#selectSession').text(selectedSession);
$('#selectCategory').text(selectedCategory);

$('#selectSessionDropdown li a').click(function(e) {
  e.preventDefault();
  localStorage.setItem('selectedSession', $(this).text());
  selectedSession = $(this).text();
  $('#selectSession').text(selectedSession);
});

$('#selectCategoryDropdown li a').click(function(e) {
  e.preventDefault();
  localStorage.setItem('selectedCategory', $(this).text());
  selectedCategory = $(this).text();
  $('#selectCategory').text(selectedCategory);
  showScramble(category[selectedCategory]);
});

function puzzlesLoaded(puzzles) {
  window.puzzles = puzzles;
  showScramble(category[selectedCategory]);
}

function showScramble(type) {
  $('#scramble').text('Scramble: ');
  $('#scrambleOutsidePanel').text('Scramble: ');
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
var chlorisgray = ['#212121', '#00e676', '#212121', '#212121', '#424242', false];
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

//Update settings selectors

$('#font').val(font);
if ($('#scrambleImage').css('display') == 'none') {
  $('#showscrambleimage').prop('checked', false);
} else {
  $('#showscrambleimage').prop('checked', true);
}
$('#hideelements').prop('checked', hideelements);
$('#bgImage').val(bgImage);
if (bgImage != 'None') {
  $('#bgImage').val('Custom');
}
$('#enableColorThemes').prop('checked', enableColorThemes);
$('#enableCustomColors').prop('checked', enableCustomColors);
$('#bgcolor').val(bgcolor);
$('#textcolor').val(textcolor);
$('#recordsbgcolor').val(recordsbgcolor);
$('#sessionbgcolor').val(sessionbgcolor);
$('#scrambleimagebgcolor').val(scrambleimagebgcolor);
$('#replaceshadow').prop('checked', replaceshadow);

if (enableColorThemes == true) {
  $('#theme').prop('disabled', false);
  $('#theme').formSelect();
  $('#theme').parent().css({'display': 'inline-block', 'width': '70%'});
  $('#bgcolor').prop('disabled', true);
  $('#textcolor').prop('disabled', true);
  $('#recordsbgcolor').prop('disabled', true);
  $('#sessionbgcolor').prop('disabled', true);
  $('#scrambleimagebgcolor').prop('disabled', true);
  $('#themeHeading').attr('class', '');
  $('#bgcolor').prev().attr('class', 'grey-text text-lighten-1');
  $('#textcolor').prev().attr('class', 'grey-text text-lighten-1');
  $('#recordsbgcolor').prev().attr('class', 'grey-text text-lighten-1');
  $('#sessionbgcolor').prev().attr('class', 'grey-text text-lighten-1');
  $('#scrambleimagebgcolor').prev().attr('class', 'grey-text text-lighten-1');
  $('#replaceshadow').prop('disabled', true);
  $('#replaceshadow').next().attr('class', 'grey-text text-lighten-1');
} else {
  $('#theme').prop('disabled', true);
  $('#theme').formSelect();
  $('#theme').parent().css({'display': 'inline-block', 'width': '70%'});
  $('#bgcolor').prop('disabled', false);
  $('#textcolor').prop('disabled', false);
  $('#recordsbgcolor').prop('disabled', false);
  $('#sessionbgcolor').prop('disabled', false);
  $('#scrambleimagebgcolor').prop('disabled', false);
  $('#themeHeading').attr('class', 'grey-text text-lighten-1');
  $('#bgcolor').prev().attr('class', '');
  $('#textcolor').prev().attr('class', '');
  $('#recordsbgcolor').prev().attr('class', '');
  $('#sessionbgcolor').prev().attr('class', '');
  $('#scrambleimagebgcolor').prev().attr('class', '');
  $('#replaceshadow').prop('disabled', false);
  $('#replaceshadow').next().attr('class', 'black-text');
}
$('#theme').val(colortheme);

//Handle settings changes

function updateTheme() {
  localStorage.setItem('bgcolor', allThemes[colortheme][0]);
  localStorage.setItem('textcolor', allThemes[colortheme][1]);
  localStorage.setItem('recordsbgcolor', allThemes[colortheme][2]);
  localStorage.setItem('sessionbgcolor', allThemes[colortheme][3]);
  localStorage.setItem('scrambleimagebgcolor', allThemes[colortheme][4]);
  localStorage.setItem('replaceshadow', allThemes[colortheme][5]);
  bgcolor = localStorage.getItem('bgcolor');
  textcolor = localStorage.getItem('textcolor');
  recordsbgcolor = localStorage.getItem('recordsbgcolor');
  sessionbgcolor = localStorage.getItem('sessionbgcolor');
  scrambleimagebgcolor = localStorage.getItem('scrambleimagebgcolor');
  replaceshadow = $.parseJSON(localStorage.getItem('replaceshadow'));
  $('#bgcolor').val(bgcolor);
  $('#textcolor').val(textcolor);
  $('#recordsbgcolor').val(recordsbgcolor);
  $('#sessionbgcolor').val(sessionbgcolor);
  $('#scrambleimagebgcolor').val(scrambleimagebgcolor);
  $('#replaceshadow').prop('checked', replaceshadow);
  $('#timer').css({
    'background-color': bgcolor,
    'color': textcolor
  });
  $('.outlined-btn').css({
    'border-color': textcolor,
    'color': textcolor
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
}

$('#font').change(function() {
  localStorage.setItem('font', $(this).val());
  font = $(this).val();
  $('#time h1').css('font-family', font);
  $('#editTimeBtn').css('right', $('#time h1').offset().left - 40);
});

$('#showscrambleimage').change(function() {
  if ($(this).prop('checked') == true) {
    localStorage.setItem('showscrambleimage', '');
    $('#scrambleImage').attr('class', '');
  } else {
    localStorage.setItem('showscrambleimage', 'hide');
    $('#scrambleImage').attr('class', 'hide');
  }
});

$('#hideelements').change(function() {
  localStorage.setItem('hideelements', $(this).prop('checked'));
  hideelements = $(this).prop('checked');
});

$('#bgImage').change(function() {
  if ($(this).val() == 'None') {
    localStorage.setItem('bgImage', 'None');
    bgImage = 'None';
    $('#timer').css('background-image', '');
  } else {
    var imageURL = prompt('Enter image URL');
    console.log(imageURL);
    if (imageURL != null) {
      localStorage.setItem('bgImage', imageURL);
      bgImage = imageURL;
      $('#timer').css('background-image', 'url('+ bgImage +')');
    } else {
      localStorage.setItem('bgImage', 'None');
      bgImage = 'None';
      $('#timer').css('background-image', '');
      $('#bgImage').val('None');
    }
  }
});

$('#enableColorThemes').change(function() {
  localStorage.setItem('enableColorThemes', $(this).prop('checked'));
  enableColorThemes = $(this).prop('checked');
  if (enableColorThemes == true) {
    //Color themes have been enabled
    localStorage.setItem('enableCustomColors', false);
    enableCustomColors = false;
    $('#enableCustomColors').prop('checked', false);
    $('#theme').prop('disabled', false);
    $('#theme').formSelect();
    $('#theme').parent().css({'display': 'inline-block', 'width': '70%'});
    $('#bgcolor').prop('disabled', true);
    $('#textcolor').prop('disabled', true);
    $('#recordsbgcolor').prop('disabled', true);
    $('#sessionbgcolor').prop('disabled', true);
    $('#scrambleimagebgcolor').prop('disabled', true);
    $('#themeHeading').attr('class', '');
    $('#bgcolor').prev().attr('class', 'grey-text text-lighten-1');
    $('#textcolor').prev().attr('class', 'grey-text text-lighten-1');
    $('#recordsbgcolor').prev().attr('class', 'grey-text text-lighten-1');
    $('#sessionbgcolor').prev().attr('class', 'grey-text text-lighten-1');
    $('#scrambleimagebgcolor').prev().attr('class', 'grey-text text-lighten-1');
    $('#replaceshadow').prop('disabled', true);
    $('#replaceshadow').next().attr('class', 'grey-text text-lighten-1');
    updateTheme();
  } else {
    //Color themes have been disabled
    localStorage.setItem('enableCustomColors', true);
    enableCustomColors = true;
    $('#enableCustomColors').prop('checked', true);
    $('#theme').prop('disabled', true);
    $('#theme').formSelect();
    $('#theme').parent().css({'display': 'inline-block', 'width': '70%'});
    $('#bgcolor').prop('disabled', false);
    $('#textcolor').prop('disabled', false);
    $('#recordsbgcolor').prop('disabled', false);
    $('#sessionbgcolor').prop('disabled', false);
    $('#scrambleimagebgcolor').prop('disabled', false);
    $('#themeHeading').attr('class', 'grey-text text-lighten-1');
    $('#bgcolor').prev().attr('class', '');
    $('#textcolor').prev().attr('class', '');
    $('#recordsbgcolor').prev().attr('class', '');
    $('#sessionbgcolor').prev().attr('class', '');
    $('#scrambleimagebgcolor').prev().attr('class', '');
    $('#replaceshadow').prop('disabled', false);
    $('#replaceshadow').next().attr('class', 'black-text');
  }
});

$('#enableCustomColors').change(function() {
  localStorage.setItem('enableCustomColors', $(this).prop('checked'));
  enableCustomColors = $(this).prop('checked');
  if (enableCustomColors == true) {
    //Custom colors have been enabled
    localStorage.setItem('enableColorThemes', false);
    enableColorThemes = false;
    $('#enableColorThemes').prop('checked', false);
    $('#theme').prop('disabled', true);
    $('#theme').formSelect();
    $('#theme').parent().css({'display': 'inline-block', 'width': '70%'});
    $('#bgcolor').prop('disabled', false);
    $('#textcolor').prop('disabled', false);
    $('#recordsbgcolor').prop('disabled', false);
    $('#sessionbgcolor').prop('disabled', false);
    $('#scrambleimagebgcolor').prop('disabled', false);
    $('#theme').parent().prev().attr('class', 'grey-text text-lighten-1');
    $('#bgcolor').prev().attr('class', '');
    $('#textcolor').prev().attr('class', '');
    $('#recordsbgcolor').prev().attr('class', '');
    $('#sessionbgcolor').prev().attr('class', '');
    $('#scrambleimagebgcolor').prev().attr('class', '');
    $('#replaceshadow').prop('disabled', false);
    $('#replaceshadow').next().attr('class', 'black-text');
  } else {
    //Custom colors have been disabled
    localStorage.setItem('enableColorThemes', true);
    enableColorThemes = true;
    $('#enableColorThemes').prop('checked', true);
    $('#theme').prop('disabled', false);
    $('#theme').formSelect();
    $('#theme').parent().css({'display': 'inline-block', 'width': '70%'});
    $('#bgcolor').prop('disabled', true);
    $('#textcolor').prop('disabled', true);
    $('#recordsbgcolor').prop('disabled', true);
    $('#sessionbgcolor').prop('disabled', true);
    $('#scrambleimagebgcolor').prop('disabled', true);
    $('#theme').parent().prev().attr('class', '');
    $('#bgcolor').prev().attr('class', 'grey-text text-lighten-1');
    $('#textcolor').prev().attr('class', 'grey-text text-lighten-1');
    $('#recordsbgcolor').prev().attr('class', 'grey-text text-lighten-1');
    $('#sessionbgcolor').prev().attr('class', 'grey-text text-lighten-1');
    $('#scrambleimagebgcolor').prev().attr('class', 'grey-text text-lighten-1');
    $('#replaceshadow').prop('disabled', true);
    $('#replaceshadow').next().attr('class', 'grey-text text-lighten-1');
    updateTheme();
  }
});

$('#theme').change(function() {
  localStorage.setItem('colortheme', $(this).val());
  colortheme = $(this).val();
  updateTheme();
});

$('#bgcolor').change(function() {
  localStorage.setItem('bgcolor', $(this).val());
  bgcolor = $(this).val();
  $('#timer').css('background-color', bgcolor);
});

$('#textcolor').change(function() {
  localStorage.setItem('textcolor', $(this).val());
  textcolor = $(this).val();
  $('#timer').css('color', textcolor);
  $('.outlined-btn').css({
    'border-color': textcolor,
    'color': textcolor
  });
});

$('#recordsbgcolor').change(function() {
  localStorage.setItem('recordsbgcolor', $(this).val());
  recordsbgcolor = $(this).val();
  $('#records').css('background-color', recordsbgcolor);
});

$('#sessionbgcolor').change(function() {
  localStorage.setItem('sessionbgcolor', $(this).val());
  sessionbgcolor = $(this).val();
  $('#session').css('background-color', sessionbgcolor);
});

$('#scrambleimagebgcolor').change(function() {
  localStorage.setItem('scrambleimagebgcolor', $(this).val());
  scrambleimagebgcolor = $(this).val();
  $('#scrambleImage').css('background-color', scrambleimagebgcolor);
});

$('#replaceshadow').change(function() {
  localStorage.setItem('replaceshadow', $(this).prop('checked'));
  replaceshadow = $(this).prop('checked');
  if (replaceshadow == true) {
    $('#records, #session, tr').css('border', '1px solid white');
    $('#records, tr').removeClass('z-depth-1');
  } else {
    $('#records, #session, tr').css('border', '');
    $('#records, tr').addClass('z-depth-1');
  }
});

$('#resetColorSettings').click(function() {
  var confirm = prompt('Type in "reset" to reset the color settings');
  if (confirm == 'reset') {
    resetColorSettings();
  }
});

function resetColorSettings() {
  localStorage.setItem('enableColorThemes', true);
  localStorage.setItem('enableCustomColors', false);
  localStorage.setItem('colortheme', 'Gray Wisp');

  var enableColorThemes = $.parseJSON(localStorage.getItem('enableColorThemes'));
  var enableCustomColors = $.parseJSON(localStorage.getItem('enableCustomColors'));
  var colortheme = localStorage.getItem('colortheme');

  localStorage.setItem('bgcolor', allThemes[colortheme][0]);
  localStorage.setItem('textcolor', allThemes[colortheme][1]);
  localStorage.setItem('recordsbgcolor', allThemes[colortheme][2]);
  localStorage.setItem('sessionbgcolor', allThemes[colortheme][3]);
  localStorage.setItem('scrambleimagebgcolor', allThemes[colortheme][4]);
  localStorage.setItem('replaceshadow', allThemes[colortheme][5]);

  var bgcolor = localStorage.getItem('bgcolor');
  var textcolor = localStorage.getItem('textcolor');
  var recordsbgcolor = localStorage.getItem('recordsbgcolor');
  var sessionbgcolor = localStorage.getItem('sessionbgcolor');
  var scrambleimagebgcolor = localStorage.getItem('scrambleimagebgcolor');
  var replaceshadow = $.parseJSON(localStorage.getItem('replaceshadow'));

  //Apply settings

  $('#timer').css({
    'background-color': bgcolor,
    'color': textcolor
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

  //Update settings selectors

  $('#enableColorThemes').prop('checked', enableColorThemes);
  $('#enableCustomColors').prop('checked', enableCustomColors);
  $('#bgcolor').val(bgcolor);
  $('#textcolor').val(textcolor);
  $('#recordsbgcolor').val(recordsbgcolor);
  $('#sessionbgcolor').val(sessionbgcolor);
  $('#scrambleimagebgcolor').val(scrambleimagebgcolor);
  $('#replaceshadow').prop('checked', replaceshadow);

  $('#theme').prop('disabled', false);
  $('#theme').formSelect();
  $('#theme').parent().css({'display': 'inline-block', 'width': '70%'});
  $('#bgcolor').prop('disabled', true);
  $('#textcolor').prop('disabled', true);
  $('#recordsbgcolor').prop('disabled', true);
  $('#sessionbgcolor').prop('disabled', true);
  $('#scrambleimagebgcolor').prop('disabled', true);
  $('#themeHeading').attr('class', '');
  $('#bgcolor').prev().attr('class', 'grey-text text-lighten-1');
  $('#textcolor').prev().attr('class', 'grey-text text-lighten-1');
  $('#recordsbgcolor').prev().attr('class', 'grey-text text-lighten-1');
  $('#sessionbgcolor').prev().attr('class', 'grey-text text-lighten-1');
  $('#scrambleimagebgcolor').prev().attr('class', 'grey-text text-lighten-1');
  $('#replaceshadow').prop('disabled', true);
  $('#replaceshadow').next().attr('class', 'grey-text text-lighten-1');
  $('#theme').val(colortheme);
}

//Edit time manually

$('#editTimeBtn').click(function() {
  if ($('#time').hasClass('hasH1') == true) {
    $('#time').html('\
      <input type="text" placeholder="0:00.000">\
    ');
    $('#time').attr('class', 'hasInput');
  } else {
    $('#time').html('<h1>0:00.000</h1>');
    $('#time h1').css('font-family', font);
    if ($(window).width() < 320) {
      $('#time h1').css('font-size', '3em');
    } else if ($(window).width() < 426) {
      $('#time h1').css('font-size', '5em');
    } else {
      $('#time h1').css('font-size', '7em');
    }
    $('#editTimeBtn').css('right', $('#time h1').offset().left - 40);
    $('#scramble').css('top', $('#time h1').offset().top + $('#time h1').height());
    $('#time').attr('class', 'hasH1');
  }
});
