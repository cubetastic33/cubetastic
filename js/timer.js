//Timer code

var greenTimeout = false;
var stopped = false;
var timerRunning = false;
var timerStartTime = 0;
var inspectionCompleted = false;

var entireTimerDiv = document.getElementById('timer');
var el = document.getElementById('time');
el.addEventListener("touchstart", handleStart, false);
el.addEventListener("touchend", handleEnd, false);
entireTimerDiv.addEventListener("touchstart", handleFullStart, false);
entireTimerDiv.addEventListener("touchend", handleFullEnd, false);

var solveInfoDialog = new mdc.dialog.MDCDialog(document.querySelector('#solveInfoDialog'));
var editSessionsDialog = new mdc.dialog.MDCDialog(document.querySelector('#editSessionsDialog'));
var chooseBGImageDialog = new mdc.dialog.MDCDialog(document.querySelector('#chooseBGImage'));
var snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
var typeOfStats = new mdc.select.MDCSelect(document.querySelector('#typeOfStats'));
var mobileTypeOfStats = new mdc.select.MDCSelect(document.querySelector('#mobileTypeOfStats'));

$(window).keydown(function(e) {
  if (e.which === 32) {
    //Prevent the page from scrolling whenever the user presses the spacebar
    e.preventDefault();
  }
  if (timerRunning === true) {
    //The timer is running; stop it
    clearInterval(startedTimer);
    stopped = true;
    timerRunning = false;
    clearInterval(startedBlinking);
    saveTime($('#time h1').text(), $('#selectSession + div ul').attr('data-selected'), $('#previousScramble').html().split('Scramble: ')[1], $('#selectCategory').text(), false);
  } else if (e.which === 32 && !e.originalEvent.repeat) {
    //The timer is not running - show red div then green div
    $('#red').attr('class', 'red');
    if (typeof inspectionTimeout != 'undefined') {
      inspectionCompleted = true;
    }
    if ($('#enableInspection').prop('checked') === true && selectedCategory != '3x3x3 bld' && inspectionCompleted === false) {
      //Inspection needs to finish before starting the timer, so show green div
      $('#green').attr('class', 'green');
    } else {
      var delayLength = $('#enableLongPress').prop('checked') ? 700 : 0;
      delayLength = (delayLength == 700 && $('#enableInspection').prop('checked') && selectedCategory != '3x3x3 bld') ? 0 : delayLength;
      greenTimeout = setTimeout(() => {$('#green').attr('class', 'green')}, delayLength);
    }
  }
});

function handleFullStart(e) {
  if (timerRunning === true) {
    //The timer is running; stop it
    clearInterval(startedTimer);
    stopped = true;
    timerRunning = false;
    clearInterval(startedBlinking);
    saveTime($('#time h1').text(), $('#selectSession + div ul').attr('data-selected'), $('#previousScramble').html().split('Scramble: ')[1], $('#selectCategory').text(), false);
  } else {
    if (typeof inspectionTimeout != 'undefined') {
      inspectionCompleted = true;
    }
  }
}

function handleStart(e) {
  e.preventDefault();
  if (timerRunning === false && stopped === false) {
    //The timer is not running - show red div then green div
    $('#red').attr('class', 'red');
    if (typeof inspectionTimeout != 'undefined') {
      inspectionCompleted = true;
    }
    if ($('#enableInspection').prop('checked') === true && selectedCategory != '3x3x3 bld' && inspectionCompleted === false) {
      //Inspection needs to finish before starting the timer, so show green div
      $('#green').attr('class', 'green');
    } else {
      var delayLength = $('#enableLongPress').prop('checked') ? 700 : 0;
      delayLength = (delayLength == 700 && $('#enableInspection').prop('checked') && selectedCategory != '3x3x3 bld') ? 0 : delayLength;
      greenTimeout = setTimeout(() => {$('#green').attr('class', 'green')}, delayLength);
    }
  }
}

$(window).keyup(function(e) {
  if (e.which === 32 && $('#green').attr('class') === 'green' && stopped === false) {
    //Start the timer; user released space bar after delayLength, and the timer was not stopped in this keypress
    if (typeof inspectionTimeout != 'undefined') {
      clearTimeout(inspectionTimeout);
      inspectionTimeout = undefined;
    }
    if ($('#enableInspection').prop('checked') === true && selectedCategory != '3x3x3 bld' && inspectionCompleted === false) {
      //Start inspection
      inspection();
      if ($('#hideelements').prop('checked') == true) {
        $('#records, #session, .button-group, #leftPanel, .mdc-fab').hide();
      }
    } else {
      var date = new Date();
      timerStartTime = date.getTime().toString();
      window.startedTimer = setInterval(timer, 10);
      stopped = false;
      $('#red').attr('class', '');
      $('#green').attr('class', '');
      window.startedBlinking = setInterval(blink, 200);
    }
    inspectionCompleted = false;
    $('#previousScramble').html($('#scramble').html());
    $('#scramble').html('');
    if ($('#hideelements').prop('checked') == true) {
      $('#records, #session, .button-group, #leftPanel, .mdc-fab').hide();
    }
  } else if (e.which === 32 && stopped === false) {
    //Reset the colors; user released space bar before delayLength, and the timer was not stopped in this keypress
    clearTimeout(greenTimeout);
    $('#red').attr('class', '');
    $('#green').attr('class', '');
  } else if (stopped === true) {
    //Timer has just been stopped.
    if ($('#hideelements').prop('checked') == true) {
      $('#records, #session, .button-group , #leftPanel, .mdc-fab').show();
      $('#installFAB, #infoFAB, #settingsFAB, #feedbackFAB').hide();
    }
    $('#red').attr('class', '');
    $('#green').attr('class', '');
    showScramble(category[selectedCategory]);
    stopped = false;
  }
});

function handleFullEnd(e) {
  if ($('#hideelements').prop('checked') == true) {
    $('#selectSession, #selectCategory, #editTimeBtn, #leftPanel, .mdc-fab').show();
    $('#installFAB, #infoFAB, #settingsFAB, #feedbackFAB').hide();
  }
  $('#red').attr('class', '');
  $('#green').attr('class', '');
  if (stopped == true) {
    showScramble(category[selectedCategory]);
  }
  stopped = false;
}

function handleEnd(e) {
  if (stopped === false && $('#green').hasClass('green') === true) {
    //Start the timer.
    if (typeof inspectionTimeout != 'undefined') {
      clearTimeout(inspectionTimeout);
      inspectionTimeout = undefined;
    }
    if ($('#enableInspection').prop('checked') === true && selectedCategory != '3x3x3 bld' && inspectionCompleted === false) {
      //Start inspection
      inspection();
      if ($('#hideelements').prop('checked') == true) {
        $('#records, #session, .button-group, #leftPanel, .mdc-fab').hide();
      }
    } else {
      var date = new Date();
      timerStartTime = date.getTime().toString();
      window.startedTimer = setInterval(timer, 10);
      stopped = false;
      $('#red').attr('class', '');
      $('#green').attr('class', '');
      window.startedBlinking = setInterval(blink, 200);
    }
    inspectionCompleted = false;
    $('#previousScramble').html($('#scramble').html());
    $('#scramble').html('');
    if ($('#hideelements').prop('checked') == true) {
      $('#records, #session, .button-group, #leftPanel, .mdc-fab').hide();
    }
  } else if (stopped === false) {
    //Reset the colors; user released space bar before delayLength, and the timer was not stopped in this keypress
    clearTimeout(greenTimeout);
    $('#red').attr('class', '');
    $('#green').attr('class', '');
  } else if (stopped === true) {
    //Timer has just been stopped.
    if ($('#hideelements').prop('checked') == true) {
      $('#records, #session, .button-group , #leftPanel, .mdc-fab').show();
      $('#installFAB, #infoFAB, #settingsFAB, #feedbackFAB').hide();
    }
    $('#red').attr('class', '');
    $('#green').attr('class', '');
    showScramble(category[selectedCategory]);
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

function inspection(i) {
  i = (typeof i !== 'undefined') ?  i : 15;
  window.plus_two = false;
  if (i == 15) {
    $('#time h1').text(i);
    i--;
  }
  if (i > 0) {
    window.inspectionTimeout = setTimeout(function() {
      $('#time h1').text(i);
      inspection(i - 1);
    }, 1000);
  } else if (i > -2) {
    window.plus_two = true;
    window.inspectionTimeout = setTimeout(function() {
      $('#time h1').text('+2');
      inspection(i - 1);
    }, 1000);
  } else if (i == -2) {
    $('#time h1').text('DNF');
  }
}

$('#refreshScramble').click(function() {
  showScramble(category[selectedCategory]);
});

//Save Times

function saveTime(time, session, scramble, category, plusTwo) {
  var d = new Date();
  if (firebase.auth().currentUser) {
    //Convert string to int
    time = (parseInt(time.split(':')[0])*60000) + (parseInt(time.split(':')[1].split('.')[0])*1000) + parseInt(time.split('.')[1]);
    $.ajax({
      type: 'POST',
      url: '/saveTime',
      data: {
        uid: firebase.auth().currentUser.uid,
        time: time,
        session: session,
        scramble: scramble,
        category: category,
        plus_two: plusTwo,
        solve_date: d.getTime()
      },
      success: function(result) {
        console.log(result);
        if (selectedSession > noOfSessions) {
          noOfSessions = selectedSession;
        }
        sessionNames = sessionNames.slice(0, noOfSessions);
        for (var i = 0; i < noOfSessions; i++) {
          if (i >= sessionNames.length) {
            if (i+1 != selectedSession) {
              sessionNames.push('Session '+(i+1));
            } else {
              sessionNames.push($('#selectSession').html());
            }
          }
        }
        localStorage.setItem('sessionNames', JSON.stringify(sessionNames));
        $('#selectSession + div ul').attr('data-selected', selectedSession);
        $('#selectSession + div ul').empty();
        for (var i=0; i<sessionNames.length; i++) {
          $('#selectSession + div ul').append('\
            <li class="mdc-list-item" role="menuitem" tabindex="0">'+sessionNames[i]+'</li>\
          ');
        }
      }
    });
  } else {
    var times = database.transaction(['times'], 'readwrite').objectStore('times');
    times.add({session: session, time: time, scramble: scramble, category: category, plusTwo: plusTwo, solveDate: d.getTime()});
    showTimesFromIndexedDB();
  }
}

//Other code

var selectedSession = parseInt(localStorage.getItem('selectedSession'));
var noOfSessions = parseInt(localStorage.getItem('noOfSessions'));
var sessionNames = JSON.parse(localStorage.getItem('sessionNames'));
var selectedCategory = localStorage.getItem('selectedCategory');
var category = {'3x3x3': '333', '2x2x2': '222', '3x3x3 bld': '333ni', 'Pyraminx': 'pyram', '4x4x4': '444', '5x5x5': '555', '6x6x6': '666', '7x7x7': '777', 'Megaminx': 'minx', 'Skewb': 'skewb', 'Square 1': 'sq1fast'}
var reset = false;

if (selectedCategory == null) {
  localStorage.setItem('selectedSession', '1');
  selectedSession = 1;
  localStorage.setItem('noOfSessions', 10);
  noOfSessions = 10;
  var sessionNames = [];
  for (var i = 1; i <= noOfSessions; i++) {
    sessionNames.push('Session '+i);
  }
  localStorage.setItem('sessionNames', JSON.stringify(sessionNames));
  reset = true;
  localStorage.setItem('selectedCategory', '3x3x3');
  selectedCategory = '3x3x3';
}

function escapeHTML(text) {
  var map = {
    '&': '&amp;amp;',
    '<': '&amp;lt;',
    '>': '&amp;gt;',
    '"': '&amp;quot;',
    "'": '&amp;#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (reset) {
    if (user) {
      db.ref('times/'+user.uid).once('value', function(data) {
        if (data.hasChildren() == false) {
          localStorage.setItem('noOfSessions', 10);
          noOfSessions = 10;
          for (var i = 0; i < noOfSessions; i++) {
            sessionNames[i] = 'Session '+(i+1);
          }
          localStorage.setItem('sessionNames', JSON.stringify(sessionNames));
        }
      });
    } else {
      localStorage.setItem('noOfSessions', 10);
      noOfSessions = 10;
      for (var i = 0; i < noOfSessions; i++) {
        sessionNames[i] = 'Session '+(i+1);
      }
      localStorage.setItem('sessionNames', JSON.stringify(sessionNames));
    }
  }
  if (user) {
    db.ref('times/'+user.uid).orderByKey().limitToLast(1).once('child_added', function(data) {
      if (parseInt(data.key.split('session')[1]) > 10) {
        localStorage.setItem('noOfSessions', data.key.split('session')[1]);
        noOfSessions = parseInt(data.key.split('session')[1]);
      } else {
        localStorage.setItem('noOfSessions', 10);
        noOfSessions = 10;
      }
      console.log(noOfSessions);
      sessionNames = sessionNames.slice(0, noOfSessions);
      for (var i = 0; i < noOfSessions; i++) {
        if (i >= sessionNames.length) {
          if (i+1 != selectedSession) {
            sessionNames.push('Session '+(i+1));
          } else {
            sessionNames.push($('#selectSession').html());
          }
        }
      }
      localStorage.setItem('sessionNames', JSON.stringify(sessionNames));
      $('#selectSession + div ul').attr('data-selected', selectedSession);
      $('#selectSession + div ul').empty();
      for (var i=0; i<sessionNames.length; i++) {
        $('#selectSession + div ul').append('\
          <li class="mdc-list-item" role="menuitem" tabindex="0">'+sessionNames[i]+'</li>\
        ');
      }
      $('#selectSession').text(sessionNames[selectedSession-1]);
    });
  }
});

$('#selectSession + div ul').attr('data-selected', selectedSession);
$('#selectSession + div ul').empty();
for (var i=0; i<sessionNames.length; i++) {
  $('#selectSession + div ul').append('\
    <li class="mdc-list-item" role="menuitem" tabindex="0">'+sessionNames[i]+'</li>\
  ');
}
$('#selectSession').text(sessionNames[selectedSession-1]);
$('#selectCategory').text(selectedCategory);

// Listen for selected item
sessionMenuEl.addEventListener('MDCMenu:selected', function(evt) {
  localStorage.setItem('selectedSession', evt.detail.index + 1);
  selectedSession = evt.detail.index + 1;
  $('#selectSession').text(evt.detail.item.innerText);
  $('#selectSession + div ul').attr('data-selected', selectedSession);
  if (firebase.auth().currentUser) {
    showTimesFromFirebase();
  } else {
    showTimesFromIndexedDB();
  }
});
categoryMenuEl.addEventListener('MDCMenu:selected', function(evt) {
  localStorage.setItem('selectedCategory', evt.detail.item.innerText);
  selectedCategory = evt.detail.item.innerText;
  $('#selectCategory').text(evt.detail.item.innerText);
  showScramble(category[selectedCategory]);
});

//Handle renaming of sessions
$('#editSessions').click(function() {
  editSessionsDialog.show();
});

$('#createNewSession').click(function() {
  var newName = $('#newSessionName').val();
  if (newName.length >= 1) {
    sessionNames.push(newName);
    localStorage.setItem('sessionNames', JSON.stringify(sessionNames));
    localStorage.setItem('noOfSessions', sessionNames.length);
    noOfSessions = selectedSession = sessionNames.length;
    localStorage.setItem('selectedSession', noOfSessions);
    $('#selectSession + div ul').attr('data-selected', selectedSession);
    $('#selectSession + div ul').empty();
    for (var i=0; i<sessionNames.length; i++) {
      $('#selectSession + div ul').append('\
        <li class="mdc-list-item" role="menuitem" tabindex="0">'+sessionNames[i]+'</li>\
      ');
    }
    $('#selectSession').text(sessionNames[selectedSession-1]);
    showTimesFromFirebase();
    $('#newSessionName').val('');
    editSessionsDialog.close();
  } else {
    snackbar.show({message: 'Error, name is too short.'});
  }
});

$('#renameSession').click(function() {
  var newName = $('#newSessionName').val();
  if (newName.length >= 1) {
    sessionNames[selectedSession-1] = newName;
    localStorage.setItem('sessionNames', JSON.stringify(sessionNames));
    $('#selectSession + div ul li:nth-child(' + (selectedSession) + '), #selectSession').text(newName);
    $('#newSessionName').val('');
    editSessionsDialog.close();
  } else {
    snackbar.show({message: 'Error, name is too short.'});
  }
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
  //Display scramble image
  $('#scrambleImage').html(tnoodlejs.scrambleToSvg(generatedScramble, puzzle, 0, 0));
}

//Show times

Array.max = function( array ){
  return Math.max.apply( Math, array );
};

Array.min = function( array ){
 return Math.min.apply( Math, array );
};

function add(a, b) {return a + b}

function formatTime(milliseconds) {
  if (Math.floor(milliseconds/60000) == 0) {
    return (milliseconds%60000-milliseconds%1000)/1000+'.'+('000'+parseInt(milliseconds%1000)).substr(-3);
  }
  return Math.floor(milliseconds/60000)+':'+(milliseconds%60000-milliseconds%1000)/1000+'.'+('000'+parseInt(milliseconds%1000)).substr(-3);
}

function calcSingle(type, range) {
  var single = '-:--.---';
  if (range.includes('-')) {
    if (/^\d+$/.test(range.split('-')[0]) && /^\d+$/.test(range.split('-')[1])) {
      if (parseInt(range.split('-')[0]) < parseInt(range.split('-')[1])) {
        if (type === 'current') {
          single = timesForAvg[parseInt(range.split('-')[1]) - 1];
        } else if (type === 'best') {
          var finalTimesForAvg = timesForAvg.filter(function(item) {
            return item !== 0;
          });
          single = Array.min(finalTimesForAvg.slice((parseInt(range.split('-')[0])-1), parseInt(range.split('-')[1])));
        } else if (type === 'worst') {
          single = Array.max(timesForAvg.slice((parseInt(range.split('-')[0])-1), parseInt(range.split('-')[1])));
        }
      } else {
        snackbar.show({message: 'Please enter numbers in ascending order, like "5-20".'});
      }
    } else {
      snackbar.show({message: 'Please enter a number range, like "5-20".'});
    }
  } else if (range === 'all') {
    if (type === 'current') {
      single = timesForAvg[timesForAvg.length - 1];
    } else if (type === 'best') {
      var finalTimesForAvg = timesForAvg.filter(function(item) {
        return item !== 0;
      });
      single = Array.min(finalTimesForAvg);
    } else if (type === 'worst') {
      var finalTimesForAvg = timesForAvg.filter(function(item) {
        return item !== 0;
      });
      single = Array.max(finalTimesForAvg);
    }
  } else {
    snackbar.show({message: 'Please enter a number range or "all" if you want your overall single.', multiline: true});
  }
  if (single !== '-:--.---') {
    return formatTime(single);
  }
  return single;
}

function calcAverage(type, range) {
  range = parseInt(range);
  remove = Math.ceil(parseInt(range)*5/100);
  var avg = '-:--.---';
  if (type === 'current') {
    if (timesForAvg.length >= range) {
      var localTimes = timesForAvg.slice(-1*range);
      for (var i = 1; i <= remove; i++) {
        localTimes.splice(localTimes.indexOf(Array.min(localTimes)), 1);
        localTimes.splice(localTimes.indexOf(Array.max(localTimes)), 1);
      }
      avg = localTimes.reduce(add, 0)/localTimes.length;
    }
  } else {
    if (timesForAvg.length >= range) {
      averages = [];
      for (var i=(range-1); i<timesForAvg.length; i++) {
        var localTimes = timesForAvg.slice(i-(range-1), i+1);
        for (var n = 1; n <= remove; n++) {
          localTimes.splice(localTimes.indexOf(Array.min(localTimes)), 1);
          localTimes.splice(localTimes.indexOf(Array.max(localTimes)), 1);
        }
        var avgOfCurrent = localTimes.reduce(add, 0)/localTimes.length;
        averages.push(avgOfCurrent);
      }

      if (type === 'best') {
        avg = Array.min(averages);
      } else {
        avg = Array.max(averages);
      }
    }
  }
  if (avg != '-:--.---') {
    return formatTime(avg);
  }
  return avg;
}

allTimes = {};

function updateRecordsStats() {
  $('#recordStats .pb').text(calcSingle('best', 'all'));
  $('#recordStats .mo3').text(formatTime(timesForAvg.slice(-3).reduce(add, 0)/3));
  $('#recordStats .ao5').text(calcAverage('current', 5));
  $('#recordStats .ao12').text(calcAverage('current', 12));
  $('#recordStats .ao50').text(calcAverage('current', 50));
  $('#recordStats .ao100').text(calcAverage('current', 100));
  $('#recordStats .ao250').text(calcAverage('current', 250));
  $('#recordStats .ao1000').text(calcAverage('current', 1000));
}

function showTimesFromFirebase() {
  db.ref('/times/'+firebase.auth().currentUser.uid+'/session'+$('#selectSession + div ul').attr('data-selected')).on('value', function(data) {
    $('#session, #sessionTimesTable').html('\
      <table>\
        <thead><tr class="mdc-elevation--z6"><th>S. No</th><th>Time</th><th>Ao5</th></tr></thead>\
        <tbody>\
        </tbody>\
      </table>\
    ');
    var n = 0;
    window.timesForAvg = [];
    var pb = '-:--.---';
    data.forEach(function(solve) {
      n++;
      var pt = formatTime(solve.val().time);
      var time = solve.val().time;
      if (solve.val().plusTwo == 'true') {
        pt = formatTime(parseInt(time) + 2000) + '+';
        time = parseInt(time) + 2000;
      } else if (solve.val().plusTwo == 'DNF') {
        pt = 'DNF';
        time = time + '(DNF)';
        timesForAvg.push(0);
        allTimes[solve.val().solveDate] = 0;
      }
      if (solve.val().plusTwo != 'DNF') {
        timesForAvg.push(parseInt(time));
        allTimes[solve.val().solveDate] = parseInt(time);
        if (pb == '-:--.---' || time < pb) {pb = time}
      }
      var solveDate = parseInt(solve.val().solveDate);
      $('#session table tbody, #sessionTimesTable table tbody').prepend('\
        <tr class="mdc-elevation--z6" data-key="'+escapeHTML(solve.key)+'" data-time="'+formatTime(time)+
        '" data-scramble="'+escapeHTML(solve.val().scramble)+'" data-category="'+escapeHTML(solve.val().category)+
        '" data-plus-two="'+escapeHTML(solve.val().plusTwo)+'" data-solve-date="'+new Date(solveDate).toLocaleString()+'"><td>'+n+'</td><td>'+pt+
        '</td><td>'+calcAverage('current', 5)+'</td></tr>\
      ');
      $('#single').text(calcSingle($('#typeOfStats select').val(), $('#singleFrom').val()));
      $('#average').text(calcAverage($('#typeOfStats select').val(), $('#averageOf').val()));
      $('#mobileSingle').text(calcSingle($('#mobileTypeOfStats select').val(), $('#mobileSingleFrom').val()));
      $('#mobileAverage').text(calcAverage($('#mobileTypeOfStats select').val(), $('#mobileAverageOf').val()));
      document.querySelector('#session').scrollTo(0, 0);
      $('#typeOfStats select, #singleFrom, #averageOf').off('change').change(function() {
        $('#single').text(calcSingle($('#typeOfStats select').val(), $('#singleFrom').val()));
        $('#average').text(calcAverage($('#typeOfStats select').val(), $('#averageOf').val()));
      });
      $('#mobileTypeOfStats select, #mobileSingleFrom, #mobileAverageOf').off('change').change(function() {
        $('#mobileSingle').text(calcSingle($('#mobileTypeOfStats select').val(), $('#mobileSingleFrom').val()));
        $('#mobileAverage').text(calcAverage($('#mobileTypeOfStats select').val(), $('#mobileAverageOf').val()));
      });
      updateRecordsStats();
      initContextMenu();
      initMobileContextMenu();
    });
  });
}

function showTimesFromIndexedDB() {
  var times = database.transaction(['times']).objectStore('times');
  var sessionTimes = times.index('session');
  $('#session, #sessionTimesTable').html('\
    <table>\
      <thead><tr class="mdc-elevation--z6"><th>S. No</th><th>Time</th><th>Ao5</th></tr></thead>\
      <tbody>\
      </tbody>\
    </table>\
  ');
  var n = 0;
  window.timesForAvg = [];
  sessionTimes.openCursor().addEventListener('success', function(event) {
    var cursor = event.target.result;
    if (cursor) {
      if (cursor.key == $('#selectSession + div ul').attr('data-selected')) {
        n++;
        var pt = '';
        var time = cursor.value.time;
        if (cursor.value.plusTwo) {
          time = time.split(':')[0] + ':' + (parseInt(time.split(':')[1].split('.')[0])+2).toString() + '.' + time.split('.')[1];
          pt = '+';
        }
        if (cursor.value.time != 'DNF') {
          timesForAvg.push((parseInt(time.split(':')[0])*60000) + (parseFloat(time.split(':')[1])*1000));
        } else {
          timesForAvg.push(0);
        }
        $('#session table tbody, #sessionTimesTable table tbody').prepend('\
          <tr class="mdc-elevation--z6" data-key="'+cursor.primaryKey+'" data-time="'+cursor.value.time+
          '" data-scramble="'+cursor.value.scramble+'" data-category="'+cursor.value.category+
          '" data-plus-two="'+cursor.value.plusTwo+'" data-solve-date="'+new Date(cursor.value.solveDate)+'"><td>'+n+'</td><td>'+time+pt+
          '</td><td>'+calcAverage('current', 5)+'</td></tr>\
        ');
        $('#single').text(calcSingle($('#typeOfStats select').val(), $('#singleFrom').val()));
        $('#average').text(calcAverage($('#typeOfStats select').val(), $('#averageOf').val()));
        $('#mobileSingle').text(calcSingle($('#mobileTypeOfStats select').val(), $('#mobileSingleFrom').val()));
        $('#mobileAverage').text(calcAverage($('#mobileTypeOfStats select').val(), $('#mobileAverageOf').val()));
        document.querySelector('#session').scrollTo(0, 0);
        $('#typeOfStats select, #singleFrom, #averageOf').off('change').change(function() {
          $('#single').text(calcSingle($('#typeOfStats select').val(), $('#singleFrom').val()));
          $('#average').text(calcAverage($('#typeOfStats select').val(), $('#averageOf').val()));
        });
        $('#mobileTypeOfStats select, #mobileSingleFrom, #mobileAverageOf').off('change').change(function() {
          $('#mobileSingle').text(calcSingle($('#mobileTypeOfStats select').val(), $('#mobileSingleFrom').val()));
          $('#mobileAverage').text(calcAverage($('#mobileTypeOfStats select').val(), $('#mobileAverageOf').val()));
        });
      }
      cursor.continue();
    }
    document.querySelector('#session').scrollTo(0, 0);
    updateRecordsStats();
    initContextMenu();
    initMobileContextMenu();
  });
}

function deleteTimeFromFirebase(key) {
  if (confirm('Are you sure you want to delete?') === true) {
    //User has confirmed he/she wants to delete the solve
    $.ajax({
      type: 'POST',
      url: '/deleteSolve',
      data: {
        uid: firebase.auth().currentUser.uid,
        session: $('#selectSession + div ul').attr('data-selected'),
        key: key
      },
      success: function(result) {
        console.log(result);
        if (result == 'Deleted solve.') {
          snackbar.show({message: result});
        }
      }
    });
  }
}

function deleteTimeFromIndexedDb(primaryKey) {
  if (confirm('Are you sure you want to delete?') === true) {
    //User has confirmed he/she wants to delete the solve
    database.transaction(['times'], 'readwrite').objectStore('times').delete(primaryKey).onsuccess = function(event) {
      //Successfully deleted the solve
      snackbar.show({message: 'Successfully deleted.'});
      showTimesFromIndexedDB();
    }
  }
}

function plusTwoTimeFromFirebase(key) {
  db.ref('/times/'+firebase.auth().currentUser.uid+'/session'+$('#selectSession + div ul').attr('data-selected')+'/'+key).once('value', function(data) {
    //Inside the selected session
    var plusTwo = !JSON.parse(data.val().plusTwo);
    $.ajax({
      type: 'POST',
      url: '/plusTwoSolve',
      data: {
        uid: firebase.auth().currentUser.uid,
        session: $('#selectSession + div ul').attr('data-selected'),
        key: key,
        plus_two: plusTwo
      },
      success: function(result) {
        console.log(result);
      }
    });
  });
}

function plusTwoTimeFromIndexedDB(primaryKey) {
  var times = database.transaction(['times'], 'readwrite').objectStore('times');
  times.get(primaryKey).onsuccess = function(event) {
    var solve = event.target.result;
    solve.plusTwo = !solve.plusTwo;
    times.put(solve, primaryKey).onsuccess = function(event) {
      showTimesFromIndexedDB();
    };
  };
}

function DNFTimeFromFirebase(key) {
  if (confirm('Are you sure you want to set this solve as DNF? It cannot be undone.')) {
    $.ajax({
      type: 'POST',
      url: '/DNFSolve',
      data: {
        uid: firebase.auth().currentUser.uid,
        session: $('#selectSession + div ul').attr('data-selected'),
        key: key
      },
      success: function(result) {
        console.log(result);
        snackbar.show({message: 'Successfully set solve as DNF.'});
      }
    });
  }
}

function DNFTimeFromIndexedDB(primaryKey) {
  if (confirm('Are you sure you want to set this solve as DNF? It cannot be undone.')) {
    var times = database.transaction(['times'], 'readwrite').objectStore('times');
    times.get(primaryKey).onsuccess = function(event) {
      var solve = event.target.result;
      solve.time = 'DNF';
      times.put(solve, primaryKey).onsuccess = function(event) {
        showTimesFromIndexedDB();
        snackbar.show({message: 'Successfully set time as DNF.', multiline: true});
      };
    };
  }
}

function deleteSessionFromFirebase() {
  if (confirm('Are you sure you want to delete this entire session? It cannot be undone.')) {
    $.ajax({
      type: 'POST',
      url: '/deleteSession',
      data: {
        uid: firebase.auth().currentUser.uid,
        session: $('#selectSession + div ul').attr('data-selected')
      },
      success: function(result) {
        console.log(result);
        snackbar.show({message: 'Successfully deleted session.'});
      }
    });
  }
}

function deleteSessionFromIndexedDB() {
  if (confirm('Are you sure you want to delete this entire session? It cannot be undone.') === true) {
    //User has confirmed he/she wants to delete the session
    var times = database.transaction(['times'], 'readwrite').objectStore('times');
    var sessionTimes = times.index('session');
    sessionTimes.openCursor().addEventListener('success', function(event) {
      var cursor = event.target.result;
      if (cursor) {
        if (cursor.key == $('#selectSession + div ul').attr('data-selected')) {
          cursor.delete();
          snackbar.show({message: 'Successfully deleted time', timeout: 200});
          showTimesFromIndexedDB();
        }
        cursor.continue();
      }
    });
  }
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    showTimesFromFirebase();
  } else {
    if (!('indexedDB' in window)) {
      console.log('This browser doesn\'t support IndexedDB');
    } else {
      var idb_request;
      idb_request = window.indexedDB.open('cubetastic', 1);
      idb_request.addEventListener('error', function(event) {
        console.log('Error with IndexedDB: ' + this.errorCode);
      });
      idb_request.addEventListener('upgradeneeded', function(event) {
        console.log('upgrade needed');
        var times = this.result.createObjectStore('times', {autoIncrement: true});
        times.createIndex('session', 'session', { unique: false });
        times.createIndex('category', 'category', { unique: false });
      });
      idb_request.addEventListener('success', function(event) {
        window.database = this.result;
        showTimesFromIndexedDB();
      });
    }
  }
});

$(window).keyup(function(e) {
  if (e.shiftKey && e.which == 46) {
    //shift + del => delete last solve
    var key = $('#session table tbody tr:first-child').attr('data-key');
    if (firebase.auth().currentUser) {
      deleteTimeFromFirebase(key);
    } else if ($('#session table tbody tr:first-child').attr('data-key')) {
      deleteTimeFromIndexedDb(parseInt(key));
    }
  } else if (e.shiftKey && e.which == 50) {
    //shift + 2 => toggle last solve as +2
    var primaryKey = $('#session table tbody tr:first-child').attr('data-key');
    if (firebase.auth().currentUser) {
      plusTwoTimeFromFirebase(primaryKey);
    } else {
      plusTwoTimeFromIndexedDB(parseInt(primaryKey));
    }
  } else if (e.shiftKey && e.which == 68) {
    //shift + D => set last solve as DNF
    var primaryKey = $('#session table tbody tr:first-child').attr('data-key');
    if (firebase.auth().currentUser) {
      DNFTimeFromFirebase(primaryKey);
    } else {
      DNFTimeFromIndexedDB(parseInt(primaryKey));
    }
  } else if (e.shiftKey && e.which == 83) {
    //shift + S => Toggle scramble image
    /*$('#showscrambleimage').prop('checked', !$('#showscrambleimage').prop('checked'));
    console.log($('#scrambleImage').attr('class'));
    if ($('#showscrambleimage').prop('checked') == true) {
      localStorage.setItem('showscrambleimage', '');
      $('#scrambleImage').attr('class', '');
    } else {
      localStorage.setItem('showscrambleimage', 'hide');
      $('#scrambleImage').attr('class', 'hide');
    }
    console.log($('#scrambleImage').attr('class'));*/
  }
});

//Context Menu

function initContextMenu() {
  $('#session tr').off().on('contextmenu', function(e) {
    var primaryKey = $(this).attr('data-key');
    var time = $(this).attr('data-time');
    var scramble = $(this).attr('data-scramble');
    var category = $(this).attr('data-category');
    var plusTwo = $(this).attr('data-plus-two');
    var solveDate = $(this).attr('data-solve-date');
    e.preventDefault();
    $('#contextMenu').css({
      'display': 'block',
      'left': e.pageX + 'px',
      'top': e.pageY-10 + 'px'
    });
    $('#viewScramble').off('click').click(function() {
      solveInfoDialog.show();
      $('#solveInfo').html('\
        <b>Category: </b>'+category+'<br>\
        <b>Solve Time: </b>'+time+'\
        <b>+2: </b>'+plusTwo+'<br>\
        <b>Scramble: </b>'+scramble+'<br>\
        <b>Solve Date: </b>'+solveDate+'<br>\
      ');
      $('#contextMenu').hide();
    });
    $('#deleteTime').off('click').click(function() {
      $('#contextMenu').hide();
      if (firebase.auth().currentUser) {
        deleteTimeFromFirebase(primaryKey);
      } else {
        deleteTimeFromIndexedDb(parseInt(primaryKey));
      }
    });
    $('#togglePlusTwo').off('click').click(function() {
      $('#contextMenu').hide();
      if (firebase.auth().currentUser) {
        plusTwoTimeFromFirebase(primaryKey);
      } else {
        plusTwoTimeFromIndexedDB(parseInt(primaryKey));
      }
    });
    $('#setAsDNF').off('click').click(function() {
      $('#contextMenu').hide();
      if (firebase.auth().currentUser) {
        DNFTimeFromFirebase(primaryKey);
      } else {
        DNFTimeFromIndexedDB(parseInt(primaryKey));
      }
    });
    $('#deleteSession').off('click').click(function() {
      $('#contextMenu').hide();
      if (firebase.auth().currentUser) {
        deleteSessionFromFirebase();
      } else {
        deleteSessionFromIndexedDB();
      }
    });
  });
}

function initMobileContextMenu() {
  $('#sessionTimesTable tr').off().on('contextmenu', function(e) {
    var primaryKey = $(this).attr('data-key');
    var time = $(this).attr('data-time');
    var scramble = $(this).attr('data-scramble');
    var category = $(this).attr('data-category');
    var plusTwo = $(this).attr('data-plus-two');
    var solveDate = $(this).attr('data-solve-date');
    e.preventDefault();
    $('#contextMenu').css({
      'display': 'block',
      'left': e.pageX + 'px',
      'top': e.pageY-10 + 'px'
    });
    $('#viewScramble').off('click').click(function() {
      solveInfoDialog.show();
      $('#solveInfo').html('\
        <b>Category: </b>'+category+'<br>\
        <b>Solve Time: </b>'+time+'\
        <b>+2: </b>'+plusTwo+'<br>\
        <b>Scramble: </b>'+scramble+'<br>\
        <b>Solve Date: </b>'+solveDate+'<br>\
      ');
      $('#contextMenu').hide();
    });
    $('#deleteTime').off('click').click(function() {
      $('#contextMenu').hide();
      if (firebase.auth().currentUser) {
        deleteTimeFromFirebase(primaryKey);
      } else {
        deleteTimeFromIndexedDb(parseInt(primaryKey));
      }
    });
    $('#togglePlusTwo').off('click').click(function() {
      $('#contextMenu').hide();
      if (firebase.auth().currentUser) {
        plusTwoTimeFromFirebase(primaryKey);
      } else {
        plusTwoTimeFromIndexedDB(parseInt(primaryKey));
      }
    });
    $('#setAsDNF').off('click').click(function() {
      $('#contextMenu').hide();
      if (firebase.auth().currentUser) {
        DNFTimeFromFirebase(primaryKey);
      } else {
        DNFTimeFromIndexedDB(parseInt(primaryKey));
      }
    });
    $('#deleteSession').off('click').click(function() {
      $('#contextMenu').hide();
      if (firebase.auth().currentUser) {
        deleteSessionFromFirebase();
      } else {
        deleteSessionFromIndexedDB();
      }
    });
  });
}

$(window).mousedown(function(e) {
  if ((!document.querySelector('#contextMenu').contains(e.target)) && (!document.querySelector('#session').contains(e.target))) {
    $('#contextMenu').hide();
  }
});

$('#contextMenu').on('contextmenu', function() {
  $('#contextMenu').hide();
});

//Settings

//Themes
var graywisp = ['#E3F2FD', '#263238', '#B0BEC5', '#CFD8DC', '#B0BEC5', false];
var dark = ['#212121', '#FFFFFF', '#000000', '#000000', '#000000', true];
var chlorisgray = ['#212121', '#00e676', '#212121', '#212121', '#424242', false];
var transparent = ['#FFFFFF', '#000000', '#00000000', '#00000000', '#00000000', false];

var allThemes = {'Gray Wisp': graywisp, 'Dark': dark, 'Chloris Gray': chlorisgray, 'Transparent': transparent};

if (localStorage.getItem('colorsMethod') == null) {
  localStorage.setItem('colorsMethod', 'theme');
  localStorage.setItem('colortheme', 'Gray Wisp');
  localStorage.setItem('font', 'Play');
  localStorage.setItem('showscrambleimage', 'hide-on-small-only');
  localStorage.setItem('showRecordStats', 'hide');
  localStorage.setItem('inspectionEnabled', false);
  localStorage.setItem('enableLongPress', false);
  localStorage.setItem('hideelements', true);
  localStorage.setItem('bgImage', 'None');
  localStorage.setItem('bgcolor', '#000000');
  localStorage.setItem('textcolor', '#ffffff');
  localStorage.setItem('recordsbgcolor', '#000000');
  localStorage.setItem('sessionbgcolor', '#000000');
  localStorage.setItem('scrambleimagebgcolor', '#000000');
  localStorage.setItem('replaceshadow', false);
}

var font = localStorage.getItem('font');
var showscrambleimage = localStorage.getItem('showscrambleimage');
var showRecordStats = localStorage.getItem('showRecordStats');
var inspectionEnabled = $.parseJSON(localStorage.getItem('inspectionEnabled'));
var enableLongPress = $.parseJSON(localStorage.getItem('enableLongPress'));
var hideelements = $.parseJSON(localStorage.getItem('hideelements'));
var bgImage = localStorage.getItem('bgImage');
var colorsMethod = localStorage.getItem('colorsMethod');
var colortheme = localStorage.getItem('colortheme');

if (colorsMethod == 'theme') {
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
$('#recordStats').attr('class', showRecordStats);
$('#timer').css({
  'background-color': bgcolor,
  'color': textcolor
});
$('.mdc-button--outlined').css({
  'border-color': textcolor,
  'color': textcolor
});
$('#records .statsText, #records .statsTextField, #typeOfStats select, #typeOfStats label').css('color', textcolor);
$('#records').css('background-color', recordsbgcolor);
$('#session').css('background-color', sessionbgcolor);
$('#scrambleImage').css('background-color', scrambleimagebgcolor);
if (replaceshadow == true) {
  $('#records, #session, tr').css('border', '1px solid white');
  $('#records, #session tr').removeClass('mdc-elevation--z6');
} else {
  $('#records, #session, tr').css('border', '');
  $('#records, #session tr').addClass('mdc-elevation--z6');
}

if (bgImage != 'None') {
  $('#timer').css('background-image', 'url('+ bgImage +')');
} else {
  $('#timer').css('background-image', '');
}

//Update settings selectors

$('#font').val(font);
$('#enableInspection').prop('checked', inspectionEnabled);
$('#enableLongPress').prop('checked', enableLongPress);
if ($('#scrambleImage').css('display') == 'none') {
  $('#showscrambleimage').prop('checked', false);
} else {
  $('#showscrambleimage').prop('checked', true);
}
$('#showRecordStats').prop('checked', showRecordStats === '');
$('#hideelements').prop('checked', hideelements);
$('#bgImage').val(bgImage);
if (bgImage != 'None') {
  $('#bgImage').val('Custom');
}
$('#theme').val(colortheme);
$('input[type=radio][name=colorsMethod]').val([colorsMethod]);
$('#bgcolor').val(bgcolor);
$('#textcolor').val(textcolor);
$('#recordsbgcolor').val(recordsbgcolor);
$('#sessionbgcolor').val(sessionbgcolor);
$('#scrambleimagebgcolor').val(scrambleimagebgcolor);
$('#replaceshadow').prop('checked', replaceshadow);
if (colorsMethod == 'theme') {
  $('#selectTheme').attr('class', 'mdc-select');
  $('#theme').prop('disabled', false);
  $('.customColorsLabel').attr('class', 'customColorsLabel disabledLabel');
  $('#colorSettings input[type=color]').prop('disabled', true);
  $('#replaceShadow').prop('disabled', true);
} else {
  $('.customColorsLabel').attr('class', 'customColorsLabel');
  $('#colorSettings input[type=color]').prop('disabled', false);
  $('#replaceShadow').prop('disabled', false);
  $('#selectTheme').attr('class', 'mdc-select mdc-select--disabled');
  $('#theme').prop('disabled', true);
}

//Handle settings changes

function updateTheme() {
  localStorage.setItem('bgcolor', allThemes[colortheme][0]);
  localStorage.setItem('textcolor', allThemes[colortheme][1]);
  localStorage.setItem('recordsbgcolor', allThemes[colortheme][2]);
  localStorage.setItem('sessionbgcolor', allThemes[colortheme][3]);
  localStorage.setItem('scrambleimagebgcolor', allThemes[colortheme][4]);
  localStorage.setItem('replaceshadow', allThemes[colortheme][5]);
  $('#bgcolor').val(allThemes[colortheme][0]);
  $('#textcolor').val(allThemes[colortheme][1]);
  $('#recordsbgcolor').val(allThemes[colortheme][2]);
  $('#sessionbgcolor').val(allThemes[colortheme][3]);
  $('#scrambleimagebgcolor').val(allThemes[colortheme][4]);
  $('#replaceshadow').prop('checked', allThemes[colortheme][5]);

  $('#timer').css({
    'background-color': allThemes[colortheme][0],
    'color': allThemes[colortheme][1]
  });
  $('.mdc-button--outlined').css({
    'border-color': allThemes[colortheme][1],
    'color': allThemes[colortheme][1]
  });
  $('#records .statsText, #records .statsTextField, #typeOfStats select, #typeOfStats label').css('color', allThemes[1]);
  $('#records').css('background-color', allThemes[colortheme][2]);
  $('#session').css('background-color', allThemes[colortheme][3]);
  $('#scrambleImage').css('background-color', allThemes[colortheme][4]);
  if (allThemes[colortheme][5] == true) {
    $('#records, #session, tr').css('border', '1px solid white');
    $('#records, #session tr').removeClass('mdc-elevation--z4');
  } else {
    $('#records, #session, tr').css('border', '');
    $('#records, #session tr').addClass('mdc-elevation--z4');
  }
}

selectFont.listen('change', function() {
  localStorage.setItem('font', selectFont.value);
  font = selectFont.value;
  $('#time h1').css('font-family', font);
  $('#editTimeBtn').css('right', $('#time h1').offset().left - 40);
});

$('#enableInspection').change(function() {
  localStorage.setItem('inspectionEnabled', $(this).prop('checked'));
  inspectionEnabled = $(this).prop('checked');
});

$('#enableLongPress').change(function() {
  localStorage.setItem('enableLongPress', $(this).prop('checked'));
  enableLongPress = $(this).prop('checked');
});

$('#showscrambleimage').change(function() {
  console.log('eh98hfe9w8hf98hefw89hy');
  if ($(this).prop('checked') == true) {
    localStorage.setItem('showscrambleimage', '');
    $('#scrambleImage').attr('class', '');
  } else {
    localStorage.setItem('showscrambleimage', 'hide');
    $('#scrambleImage').attr('class', 'hide');
  }
});

$('#showRecordStats').change(function() {
  if ($(this).prop('checked')) {
    localStorage.setItem('showRecordStats', '');
    showRecordStats = '';
  } else {
    localStorage.setItem('showRecordStats', 'hide');
    showRecordStats = 'hide';
  }
  $('#recordStats').attr('class', showRecordStats);
});

$('#hideelements').change(function() {
  localStorage.setItem('hideelements', $(this).prop('checked'));
  hideelements = $(this).prop('checked');
});

selectBGImage.listen('change', function() {
  if (selectBGImage.value === 'None') {
    localStorage.setItem('bgImage', selectBGImage.value);
    bgImage = 'None';
    $('#timer').css('background-image', '');
  } else if (selectBGImage.value === 'Choose') {
    chooseBGImageDialog.show();
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

$('#chooseBGImage .mdc-image-list li').click(function() {
  localStorage.setItem('bgImage', $(this).attr('data-image'));
  bgImage = $(this).attr('data-image');
  $('#timer').css('background-image', 'url('+ bgImage +')');
  $('#bgImage').val('Custom');
  chooseBGImageDialog.close();
});

$('input[type=radio][name=colorsMethod]').change(function() {
  localStorage.setItem('colorsMethod', $(this).val());
  colorsMethod = $(this).val();
  if (colorsMethod == 'theme') {
    $('#selectTheme').attr('class', 'mdc-select');
    $('#theme').prop('disabled', false);
    $('.customColorsLabel').attr('class', 'customColorsLabel disabledLabel');
    $('#colorSettings input[type=color]').prop('disabled', true);
    $('#replaceShadow').prop('disabled', true);
    updateTheme();
  } else {
    $('.customColorsLabel').attr('class', 'customColorsLabel');
    $('#colorSettings input[type=color]').prop('disabled', false);
    $('#replaceShadow').prop('disabled', false);
    $('#selectTheme').attr('class', 'mdc-select mdc-select--disabled');
    $('#theme').prop('disabled', true);
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
  $('#timer, #records .statsText, #records .statsTextField, #typeOfStats select, #typeOfStats label').css('color', textcolor);
  $('.mdc-button--outlined').css({
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
    $('#records, #session tr').removeClass('mdc-elevation--z4');
  } else {
    $('#records, #session, tr').css('border', '');
    $('#records, #session tr').addClass('mdc-elevation--z4');
  }
});

$('#resetColorSettings').click(function() {
  var confirm = prompt('Type in "reset" to reset the color settings');
  if (confirm === 'reset') {
    resetColorSettings();
  }
});

function resetColorSettings() {
  localStorage.setItem('colorsMethod', 'theme');
  localStorage.setItem('colortheme', 'Gray Wisp');
  colortheme = 'Gray Wisp';
  updateTheme();
  //Update settings selectors
  $('input[type=radio][name=colorsMethod]').val(['theme']);
  $('#selectTheme').attr('class', 'mdc-select');
  $('#theme').prop('disabled', false);
  $('.customColorsLabel').attr('class', 'customColorsLabel disabledLabel');
  $('#colorSettings input[type=color]').prop('disabled', true);
  $('#replaceShadow').prop('disabled', true);
  $('#theme').val(colortheme);
}

//Edit time manually

$('#editTimeBtn').click(function() {
  if ($('#time').hasClass('hasH1') == true) {
    $('#time').html('\
      <input type="text" placeholder="coming soon!">\
    ');
    $('#time').attr('class', 'hasInput');
  } else {
    $('#time').html('<h1>0:00.000</h1>');
    $('#time h1').css('font-family', font);
    $('#editTimeBtn').css('right', $('#time h1').offset().left - 40);
    $('#scramble').css('top', $('#time h1').offset().top + $('#time h1').height());
    $('#time').attr('class', 'hasH1');
  }
});
