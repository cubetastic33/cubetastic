//Timer code

var greenTimeout = false;
var stopped = false;
var timerRunning = false;
var timerStartTime = 0;
var inspectionCompleted = false;
var plus_two = false;
var finishedReminders = [];

var entireTimerDiv = document.getElementById('timer');
var el = document.getElementById('time');
el.addEventListener("touchstart", handleStart, false);
el.addEventListener("touchend", handleEnd, false);
entireTimerDiv.addEventListener("touchstart", handleFullStart, false);
entireTimerDiv.addEventListener("touchend", handleFullEnd, false);

var solveInfoDialog = new mdc.dialog.MDCDialog(document.querySelector('#solveInfoDialog'));
var editSessionsDialog = new mdc.dialog.MDCDialog(document.querySelector('#editSessionsDialog'));
var chooseBGImageDialog = new mdc.dialog.MDCDialog(document.querySelector('#chooseBGImage'));
var addSolvesDialog = new mdc.dialog.MDCDialog(document.querySelector('#addSolvesDialog'));
var snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
var typeOfStats = new mdc.select.MDCSelect(document.querySelector('#typeOfStats'));
var mobileTypeOfStats = new mdc.select.MDCSelect(document.querySelector('#mobileTypeOfStats'));

var player = new talkify.Html5Player();

$(window).keydown(function(e) {
  if (!$(e.target).is(':input')) {
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
      saveTime($('#time h1').text(), $('#selectSession + div ul').attr('data-selected'), $('#previousScramble').html().split('Scramble: ')[1], $('#selectCategory').text(), window.plus_two);
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
  if (!$(e.target).is(':input')) {
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
      if ($('#scramble').html() !== '') {
        $('#previousScramble').html($('#scramble').html());
        $('#scramble').html('');
      }
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
        $('#importFAB, #infoFAB, #settingsFAB, #feedbackFAB').hide();
      }
      $('#red').attr('class', '');
      $('#green').attr('class', '');
      finishedReminders = [];
      showScramble(category[selectedCategory]);
      stopped = false;
    }
  }
});

function handleFullEnd(e) {
  if ($('#hideelements').prop('checked') == true) {
    $('#selectSession, #selectCategory, #leftPanel, .mdc-fab').show();
    $('#importFAB, #infoFAB, #settingsFAB, #feedbackFAB').hide();
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
    if ($('#scramble').html() !== '') {
      $('#previousScramble').html($('#scramble').html());
      $('#scramble').html('');
    }
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
      $('#importFAB, #infoFAB, #settingsFAB, #feedbackFAB').hide();
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
  if (minutes > 60) {
    minutes = `${Math.floor(minutes/60)}:${minutes-(60*Math.floor(minutes/60))}`;
  }
  $('#time h1').html(`${minutes}:${seconds}.${milliseconds}`);
}

function timer() {
  if (stopped == false) {
    timerRunning = true;
    var d = new Date();
    var minutes = parseInt((d.getTime() - timerStartTime) / 60000);
    var seconds = '00' + (parseInt(((d.getTime() - timerStartTime) % 60000) / 1000)).toString();
    seconds = seconds.substr((seconds.length - 2), (seconds.length));
    var milliseconds = '000' + ((d.getTime() - timerStartTime) % 1000).toString();
    milliseconds = milliseconds.substr((milliseconds.length - 3), (milliseconds.length));
    window.lastTime = minutes + ':' + seconds + '.' + milliseconds.substr(0, 3);
    printTime(minutes, seconds, milliseconds.substr(0, 3));
    var settings = localStorage.getItem('settings').split('|');
    settings[18] = settings[18].split(';');
    if ($('#toggleReminders').prop('checked') === true && settings[18].includes((parseInt(minutes) * 60 + parseInt(seconds)).toString()) && finishedReminders.includes((parseInt(minutes) * 60 + parseInt(seconds)).toString()) === false) {
      if (parseInt(minutes) > 0) {
        player.forceLanguage('en-GB').playText(minutes.toString() + `minute${parseInt(minutes)===1?'':'s'}${parseInt(seconds)===0?'':(', '+seconds.toString()+`second${parseInt(seconds)===1?'':'s'}`)}`);
      } else {
        player.forceLanguage('en-GB').playText(seconds.toString() + `second${parseInt(seconds)===1?'':'s'}`);
      }
      finishedReminders.push((parseInt(minutes) * 60 + parseInt(seconds)).toString());
    }
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
  if (i === 2 && $('#enableAudioCues').prop('checked') === true) {
    document.getElementById('12Seconds').play();
  } else if (i === 7 && $('#enableAudioCues').prop('checked') === true) {
    document.getElementById('8Seconds').play();
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
    plusTwo = {'false': '0', 'true': '2'}[plusTwo.toString()];
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
  if (Math.floor(milliseconds / 60000) === 0) {
    return (milliseconds % 60000 - milliseconds % 1000) / 1000 + '.' + ('000' + parseInt(milliseconds % 1000)).substr(-3);
  } else if (Math.floor(milliseconds / 3600000) === 0) {
    return `${Math.floor(milliseconds/60000)}:${(milliseconds%60000-milliseconds%1000)/1000}.${('000'+parseInt(milliseconds%1000)).substr(-3)}`;
  } else {
    return `${Math.floor(milliseconds/3600000)}:${Math.floor(milliseconds/60000)-(60*Math.floor(milliseconds/3600000))}:${(milliseconds%60000-milliseconds%1000)/1000}.${('000'+parseInt(milliseconds%1000)).substr(-3)}`;
  }
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
  db.ref('/times/'+firebase.auth().currentUser.uid+'/session'+$('#selectSession + div ul').attr('data-selected')).on('value', (snapshot) => {
    var limit = Array.max([100, $('#session table tbody tr').length]);
    $('#session, #sessionTimesTable').html(`
      <table>
        <thead><tr class="mdc-elevation--z1"><th>S. No</th><th>Time</th><th>Ao5</th></tr></thead>
        <tbody>
        </tbody>
      </table>
    `);
    window.timesForAvg = [];
    var pb = '-:--.---';
    snapshot.forEach((data) => {
      var solve = data.val().split('|');
      solve[1] = parseInt(solve[1]);
      solve[3] = $.parseJSON(solve[3]);
      solve[4] = parseInt(solve[4]);
      if (solve.length > 6) {
        solve[5] = solve.slice(5).join('|');
        solve = solve.slice(0, 6);
      }
      //Now, solve is in the format of [category, time, scramble, penalty, solveDate, (opt)comment]
      var time = solve[1];
      if (solve[3] === 2) {
        time += 2000;
        dt = formatTime(time) + '+';
      } else if (solve[3] === 1) {
        dt = 'DNF';
        time += '(DNF)';
        timesForAvg.push(0);
        allTimes[solve[4]] = 0;
      }
      if (solve[3] !== 1) {
        timesForAvg.push(time);
        allTimes[solve[4]] = time;
        if (pb == '-:--.---' || time < pb) {pb = time}
      }
    });
    db.ref('/times/'+firebase.auth().currentUser.uid+'/session'+$('#selectSession + div ul').attr('data-selected')).limitToLast(limit).once('value', function(data) {
      console.log(snapshot.numChildren());
      var n = snapshot.numChildren()-data.numChildren();
      var pb = '-:--.---';
      data.forEach(function(snapshot) {
        n++;
        var solve = snapshot.val().split('|');
        solve[1] = parseInt(solve[1]);
        solve[3] = $.parseJSON(solve[3])
        solve[4] = parseInt(solve[4]);
        if (solve.length > 6) {
          solve[5] = solve.slice(5).join('|');
          solve = solve.slice(0, 6);
        }
        //Now, solve is in the format of [category, time, scramble, penalty, solveDate, (opt)comment]
        var time = solve[1];
        var dt = formatTime(solve[1]);
        var comment = solve[5] || '';
        if (solve[3] === 2) {
          time += 2000;
          dt = formatTime(time) + '+';
        } else if (solve[3] === 1) {
          dt = 'DNF';
          time += '(DNF)';
        }
        if (solve[3] !== 1) {
          if (pb == '-:--.---' || time < pb) {pb = time}
        }
        $('#session table tbody, #sessionTimesTable table tbody').prepend('\
          <tr class="mdc-elevation--z1" data-key="'+escapeHTML(snapshot.key)+'" data-time="'+formatTime(time)+
          '" data-scramble="'+escapeHTML(solve[2])+'" data-category="'+escapeHTML(solve[0])+
          '" data-penalty="'+escapeHTML(solve[3].toString())+'" data-solve-date="'+new Date(solve[4]).toLocaleString()+
          '" data-comment="'+comment+'"><td>'+n+'</td><td>'+dt+
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
        $('#session, #sessionDrawer .mdc-drawer__content').off('scroll').scroll(() => {
          if ($('#session').prop('scrollHeight') - $('#session').prop('scrollTop') === $('#session').prop('clientHeight')) {
            //User has scrolled to bottom, load more solves
            var lastSolveKey = $('#session table tbody tr:last-child').attr('data-key');
            console.log(document.querySelector('#session table tbody tr:last-child'));
            db.ref('/times/'+firebase.auth().currentUser.uid+'/session'+$('#selectSession + div ul').attr('data-selected'))
            .orderByKey().endAt(lastSolveKey).limitToLast(11).on('value', (datasnapshot) => {
              console.log(snapshot.numChildren());
              i = n-$('#session table tbody tr').length-10;
              datasnapshot.forEach((child) => {
                i++;
                if (child.key != lastSolveKey) {
                  var solve = child.val().split('|');
                  solve[1] = parseInt(solve[1]);
                  solve[3] = $.parseJSON(solve[3])
                  solve[4] = parseInt(solve[4]);
                  if (solve.length > 6) {
                    solve[5] = solve.slice(5).join('|');
                    solve = solve.slice(0, 6);
                  }
                  //Now, solve is in the format of [category, time, scramble, penalty, solveDate, (opt)comment]
                  var time = solve[1];
                  var dt = formatTime(solve[1]);
                  var comment = solve[5] || '';
                  if (solve[3] === 2) {
                    time += 2000;
                    dt = formatTime(time) + '+';
                  } else if (solve[3] === 1) {
                    dt = 'DNF';
                    time += '(DNF)';
                    timesForAvg.unshift(0);
                    allTimes[solve[4]] = 0;
                  }
                  if (solve[3] !== 1) {
                    timesForAvg.unshift(time);
                    allTimes[solve[4]] = time;
                    if (pb == '-:--.---' || time < pb) {pb = time}
                  }
                  $('#session table tr[data-key="'+lastSolveKey+'"], #sessionTimesTable table tr[data-key="'+lastSolveKey+'"]').after('\
                    <tr class="mdc-elevation--z1" data-key="'+escapeHTML(child.key)+'" data-time="'+formatTime(time)+
                    '" data-scramble="'+escapeHTML(solve[2])+'" data-category="'+escapeHTML(solve[0])+
                    '" data-penalty="'+escapeHTML(solve[3].toString())+'" data-solve-date="'+new Date(solve[4]).toLocaleString()+
                    '" data-comment="'+comment+'"><td>'+i+'</td><td>'+dt+
                    '</td><td>-:--.---</td></tr>\
                  ');
                  $('#single').text(calcSingle($('#typeOfStats select').val(), $('#singleFrom').val()));
                  $('#average').text(calcAverage($('#typeOfStats select').val(), $('#averageOf').val()));
                  $('#mobileSingle').text(calcSingle($('#mobileTypeOfStats select').val(), $('#mobileSingleFrom').val()));
                  $('#mobileAverage').text(calcAverage($('#mobileTypeOfStats select').val(), $('#mobileAverageOf').val()));
                }
              });
              updateRecordsStats();
              initContextMenu();
              initMobileContextMenu();
            });
          }
        });
        updateRecordsStats();
        initContextMenu();
        initMobileContextMenu();
      });
    });
  });
}

function showTimesFromIndexedDB() {
  var times = database.transaction(['times']).objectStore('times');
  var sessionTimes = times.index('session');
  $('#session, #sessionTimesTable').html(`
    <table>
      <thead><tr class="mdc-elevation--z1"><th>S. No</th><th>Time</th><th>Ao5</th></tr></thead>
      <tbody>
      </tbody>
    </table>
  `);
  var n = 0;
  window.timesForAvg = [];
  sessionTimes.openCursor().addEventListener('success', function(event) {
    var cursor = event.target.result;
    if (cursor) {
      if (cursor.key == $('#selectSession + div ul').attr('data-selected')) {
        n++;
        var pt = '';
        var time = cursor.value.time;
        var comment = '';
        if (cursor.value.plusTwo) {
          time = time.split(':')[0] + ':' + (parseInt(time.split(':')[1].split('.')[0])+2).toString() + '.' + time.split('.')[1];
          pt = '+';
        }
        if (cursor.value.time != 'DNF') {
          timesForAvg.push((parseInt(time.split(':')[0])*60000) + (parseFloat(time.split(':')[1])*1000));
        } else {
          timesForAvg.push(0);
        }
        console.log({'true': '2', 'false': '0'}[(cursor.value.plusTwo).toString()]);
        if (cursor.value.comment) {
          comment = cursor.value.comment;
        }
        $('#session table tbody, #sessionTimesTable table tbody').prepend('\
          <tr class="mdc-elevation--z1" data-key="'+cursor.primaryKey+'" data-time="'+cursor.value.time+
          '" data-scramble="'+cursor.value.scramble+'" data-category="'+cursor.value.category+
          '" data-penalty="'+{'true': '2', 'false': '0'}[(cursor.value.plusTwo).toString()]+'" data-solve-date="'+new Date(cursor.value.solveDate)+
          '" data-comment="'+comment+'"><td>'+n+'</td><td>'+time+pt+
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

function penalizeTimeFromFirebase(key, type) {
  //If type is 1, then DNF; if type is 2, then +2
  $.ajax({
    type: 'POST',
    url: '/penalizeSolve',
    data: {
      uid: firebase.auth().currentUser.uid,
      session: $('#selectSession + div ul').attr('data-selected'),
      key: key,
      penalty: type
    },
    success: function(result) {
      console.log(result);
    }
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
    $('#syncSettings').html(`
      <button id="saveSettingsToAccount" class="mdc-button">
        <i class="material-icons mdc-button__icon" aria-hidden="true">save</i>Save settings to account
      </button><br>
      <button id="syncSettingsFromAccount" class="mdc-button">
        <i class="material-icons mdc-button__icon" aria-hidden="true">sync</i>Sync settings from account
      </button>
    `);
    $('#saveSettingsToAccount').click(() => {
      $.ajax({
        type: 'POST',
        url: '/saveSettings',
        data: {
          uid: firebase.auth().currentUser.uid,
          settings: localStorage.getItem('settings')
        },
        success: function(result) {
          console.log(result);
          snackbar.show({message: result});
        }
      });
    });
    $('#syncSettingsFromAccount').click(() => {
      db.ref('/users/'+firebase.auth().currentUser.uid+'/settings').once('value', (syncedSettings) => {
        console.log(syncedSettings.val());
        if (syncedSettings.val()) {
          //Sync settings
          localStorage.setItem('settings', syncedSettings.val());
          updateSettings();
          updateSettingsUI();
          snackbar.show({message: 'Done'});
        } else {
          //No settings were found
          snackbar.show({message: 'No settings were found.'});
        }
      });
    });
  } else {
    $('#syncSettings').empty();
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
      penalizeTimeFromFirebase(primaryKey, 2);
    } else {
      plusTwoTimeFromIndexedDB(parseInt(primaryKey));
    }
  } else if (e.shiftKey && e.which == 68) {
    //shift + D => set last solve as DNF
    var primaryKey = $('#session table tbody tr:first-child').attr('data-key');
    if (firebase.auth().currentUser) {
      penalizeTimeFromFirebase(primaryKey, 1);
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
    var penalty = $(this).attr('data-penalty');
    var solveDate = $(this).attr('data-solve-date');
    var comment = $(this).attr('data-comment').length > 0 ? $(this).attr('data-comment') : false;
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
        <b>Penalty: </b>'+['None', 'DNF', '+2'][parseInt(penalty)]+'<br>\
        <b>Scramble: </b>'+scramble+'<br>\
        <b>Solve Date: </b>'+solveDate+'<br>\
      ');
      if (comment !== false) {
        $('#solveInfo').append('<b>Comment: </b>'+comment+'<br>');
      }
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
        penalizeTimeFromFirebase(primaryKey, 2);
      } else {
        plusTwoTimeFromIndexedDB(parseInt(primaryKey));
      }
    });
    $('#setAsDNF').off('click').click(function() {
      $('#contextMenu').hide();
      if (firebase.auth().currentUser) {
        penalizeTimeFromFirebase(primaryKey, 1);
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
    var penalty = $(this).attr('data-penalty');
    var solveDate = $(this).attr('data-solve-date');
    var comment = $(this).attr('data-comment').length > 0 ? $(this).attr('data-comment') : false;
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
        <b>Penalty: </b>'+['None', 'DNF', '+2'][parseInt(penalty)]+'<br>\
        <b>Scramble: </b>'+scramble+'<br>\
        <b>Solve Date: </b>'+solveDate+'<br>\
      ');
      if (comment !== false) {
        $('#solveInfo').append('<b>Comment: </b>'+comment+'<br>');
      }
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
        penalizeTimeFromFirebase(primaryKey, 2);
      } else {
        plusTwoTimeFromIndexedDB(parseInt(primaryKey));
      }
    });
    $('#setAsDNF').off('click').click(function() {
      $('#contextMenu').hide();
      if (firebase.auth().currentUser) {
        penalizeTimeFromFirebase(primaryKey, 1);
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

$('#addSolves').click(() => {
  $('#contextMenu').hide();
  addSolvesDialog.show();
});

function verifyTimeAndScramble(time, scramble) {
  //Verify time
  if (/^[+\-0-9:\.]+$/.test(time) === true) {
    if (time.includes(':') === true) {
      if (time.split(':')[0].length > 2) {
        return 'Make sure time is in format minutes:seconds.milliseconds';
      } else if (time.split(':')[1].includes('.') === false) {
        return 'Make sure time is in format minutes:seconds.milliseconds';
      } else {
        if (time.split(':')[1].split('.')[0].length !== 2) {
          return 'Make sure time is in format minutes:seconds.milliseconds';
        }
      }
    } else {
      if (time.includes('.') === false) {
        return 'Make sure time is in format seconds.milliseconds';
      } else if (time.split('.')[0].length > 2) {
        return 'Make sure time is in format seconds.milliseconds';
      } else if (time.split('.')[1].length > 3) {
        return 'Make sure time is in format minutes:seconds.milliseconds';
      }
    }
  } else {
    return 'Make sure the time contains only numbers, colons, and decimal points.';
  }
  //Verify scramble
  if (scramble.length > 0) {
    //If user has specified a scramble
    if (scramble.match(/[`~!@#$₹%^&*\|;[\]{}qetiopasghjkcvnmQTIOPAGHJKCVN]+/)) {
      return 'Make sure your scramble contains only conventional notations.';
    } else if (scramble.length > 420) {
      return 'The scramble is too long!';
    }
    if (['3x3x3', '2x2x2', '3x3x3 bld', 'Skewb'].includes($('#newSolveCategory').val())) {
      if (/^[RLUDFBMSE '2wrludfbxyz]+$/.test(scramble) === false) {
        return 'Make sure you have selected the correct category for your scramble';
      }
    }
  }
  return true;
}

$('#newSolveBtn').click(() => {
  if ($('#newSolve .mdc-list-item__primary-text input').val().length > 0) {
    //Check the time and scramble if they have illegal characters
    var clean = verifyTimeAndScramble($('#newSolve .mdc-list-item__primary-text input').val(), $('#newSolve .mdc-list-item__secondary-text input').val());
    if (clean === true) {
      $('#newSolve').after(`
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">
            <span class="mdc-list-item__primary-text">${$('#addSolvesDialog ul li').length}. ${$('#newSolve .mdc-list-item__primary-text input').val()}</span>
            <span class="mdc-list-item__secondary-text">Category: ${$('#newSolve .mdc-list-item__secondary-text select').val()} | Scramble: ${$('#newSolve .mdc-list-item__secondary-text input').val()}</span>
          </span>
          <i class="removeNewSolve mdc-icon-button mdc-list-item__meta material-icons" onclick="removeNewSolve(this)">clear</i>
        </li>
      `);
      $('#newSolve .mdc-list-item__primary-text input').val('');
      $('#newSolve .mdc-list-item__secondary-text input').val('');
    } else {
      snackbar.show({message: clean, multiline: true});
    }
  }
});

function removeNewSolve(element) {
  element.parentNode.parentNode.removeChild(element.parentNode);
  $($('#addSolvesDialog ul li').get().reverse()).each((i, elem) => {
    if (i < ($('#addSolvesDialog ul li').length - 1)) {
      $(elem).find('.mdc-list-item__primary-text').html(i+1 + '. ' + ($(elem).find('.mdc-list-item__primary-text').html()).split('. ')[1]);
    }
  });
}

function convertToSeconds(time) {
  if (time.includes(':') === true) {
    return (parseInt(time.split(':')[0])*60)+parseFloat(time.split(':')[1]);
  } else {
    return parseFloat(time);
  }
}

$('#addSolvesBtn').click(() => {
  if ($('#addSolvesDialog ul li').length > 1) {
    var solves = [$('#selectSession + div ul').attr('data-selected'), $('#newSolveCategory').val()];
    $($('#addSolvesDialog ul li').get().reverse()).each((i, elem) => {
      if (i < ($('#addSolvesDialog ul li').length - 1)) {
        //Populate solves with data from each elem except the "new solve" elem, which is the last one.
        var time = $(elem).find('.mdc-list-item__primary-text').html().split('. ')[1];
        var scramble = $(elem).find('.mdc-list-item__secondary-text').html().split('Scramble: ')[1];
        var d = new Date();
        solves.push([convertToSeconds(time)*1000, scramble, 0, d.getTime()]);
      }
    });
    $('#addSolvesDialog section').html(`
      <div role="progressbar" class="mdc-linear-progress mdc-linear-progress--indeterminate">
        <div class="mdc-linear-progress__buffering-dots"></div>
        <div class="mdc-linear-progress__buffer"></div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
      </div>
    `);
    $('#addSolvesDialog footer button').prop('disabled', true);
    $.ajax({
      type: 'POST',
      url: '/uploadSolves',
      data: {
        uid: firebase.auth().currentUser.uid,
        solves: JSON.stringify(solves)
      },
      success: function(result) {
        console.log(result);
        if (result === 'Done!') {
          $('#addSolvesDialog section').html(`
            Note: You can set solves as +2 or DNF <i>after</i> adding them to your session.
            <ul class="mdc-list mdc-list--two-line mdc-list--non-interactive" aria-orientation="vertical">
              <li id="newSolve" class="mdc-list-item">
                <span class="mdc-list-item__text">
                  <span class="mdc-list-item__primary-text"><input type="text" placeholder="21.415"></span>
                  <span class="mdc-list-item__secondary-text"><div>Category: <select id="newSolveCategory">
                    <option value="3x3x3">3x3x3</option>
                    <option value="2x2x2">2x2x2</option>
                    <option value="3x3x3 bld">3x3x3 bld</option>
                    <option value="Pyraminx">Pyraminx</option>
                    <option value="4x4x4">4x4x4</option>
                    <option value="5x5x5">5x5x5</option>
                    <option value="6x6x6">6x6x6</option>
                    <option value="7x7x7">7x7x7</option>
                    <option value="Megaminx">Megaminx</option>
                    <option value="Skweb">Skweb</option>
                    <option value="Square 1">Square 1</option>
                  </select></div><div> | </div><div><label>Scramble (opt):</label><input type="text" placeholder="R' F R B' R2 D' F U' F' R2 U' L2 B2 D R2 U L2 F2 D B2"></div></span>
                </span>
                <i id="newSolveBtn" class="mdc-icon-button mdc-list-item__meta material-icons">add</i>
              </li>
            </ul>
          `);
          mdc.ripple.MDCRipple.attachTo(document.querySelector('#newSolveBtn'));
          $('#addSolvesDialog footer button').prop('disabled', false);
          $('#newSolveBtn').click(() => {
            if ($('#newSolve .mdc-list-item__primary-text input').val().length > 0) {
              $('#newSolve').after(`
                <li class="mdc-list-item">
                  <span class="mdc-list-item__text">
                    <span class="mdc-list-item__primary-text">${$('#addSolvesDialog ul li').length}. ${$('#newSolve .mdc-list-item__primary-text input').val()}</span>
                    <span class="mdc-list-item__secondary-text">Category: ${$('#newSolve .mdc-list-item__secondary-text select').val()} | Scramble: ${$('#newSolve .mdc-list-item__secondary-text input').val()}</span>
                  </span>
                  <i class="removeNewSolve mdc-icon-button mdc-list-item__meta material-icons" onclick="removeNewSolve(this)">clear</i>
                </li>
              `);
            }
            $('#newSolve .mdc-list-item__primary-text input').val('');
            $('#newSolve .mdc-list-item__secondary-text input').val('');
          });
          addSolvesDialog.close();
        }
      }
    });
  } else {
    snackbar.show({message: 'Make sure you have added at least 1 solve using the + button!', multiline: true});
  }
});

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
var graywisp = ['#E1F5FE', '#263238', '#F1F1FA', '#F1F1FA', '#F1F1FA', false];
var dark = ['#212121', '#FFFFFF', '#000000', '#000000', '#000000', true];
var chlorisgray = ['#212121', '#00e676', '#212121', '#212121', '#424242', false];
var transparent = ['#FFFFFF', '#000000', '#00000000', '#00000000', '#00000000', false];

var allThemes = {'Gray Wisp': graywisp, 'Dark': dark, 'Chloris Gray': chlorisgray, 'Transparent': transparent};

//Settings:
//'colorsMethod|colortheme|font|showscrambleimage|showRecordStats|inspectionEnabled|audioCues|enableLongPress|hideelements|
//bgImage|bgcolor|textcolor|recordsbgcolor|sessionbgcolor|scrambleimagebgcolor|replaceshadow|enableReminders|reminderType|reminders'

if (localStorage.getItem('settings') == null) {
  localStorage.setItem('settings', [
    localStorage.getItem('colorsMethod') || 'theme', localStorage.getItem('colortheme') || 'Gray Wisp',
    localStorage.getItem('font') || 'Play', localStorage.getItem('showscrambleimage') || 'hide-on-small-only',
    localStorage.getItem('showRecordStats') || 'hide', localStorage.getItem('inspectionEnabled') || 'false',
    localStorage.getItem('audioCues') || 'false', localStorage.getItem('enableLongPress') || 'true',
    localStorage.getItem('hideelements') || 'true', localStorage.getItem('bgImage') || 'None',
    localStorage.getItem('bgcolor') || '#000000', localStorage.getItem('textcolor') || '#ffffff',
    localStorage.getItem('recordsbgcolor') || '#000000', localStorage.getItem('sessionbgcolor') || '#000000',
    localStorage.getItem('scrambleimagebgcolor') || '#000000', localStorage.getItem('replaceshadow') || 'false',
    'false', 'audial', ''
  ].join('|'));
}

if (localStorage.getItem('settings').split('|')[0] == 'theme') {
  var settings = localStorage.getItem('settings').split('|');
  settings[10] = allThemes[settings[1]][0];
  settings[11] = allThemes[settings[1]][1];
  settings[12] = allThemes[settings[1]][2];
  settings[13] = allThemes[settings[1]][3];
  settings[14] = allThemes[settings[1]][4];
  settings[15] = allThemes[settings[1]][5];
  localStorage.setItem('settings', settings.join('|'));
}

function updateSettings() {
  var settings = localStorage.getItem('settings').split('|');
  console.log(settings);
  $('#time h1').css('font-family', settings[2]);
  $('#scrambleImage').attr('class', settings[3]);
  $('#recordStats').attr('class', settings[4]);
  $('#timer').css({
    'background-color': settings[10],
    'color': settings[11]
  });
  $('.mdc-button--outlined:not(.exception)').css({
    'border-color': settings[11],
    'color': settings[11]
  });
  $('#records .statsText, #records .statsTextField, #typeOfStats select, #typeOfStats label').css('color', settings[11]);
  $('#records').css('background-color', settings[12]);
  $('#session').css('background-color', settings[13]);
  $('#scrambleImage').css('background-color', settings[14]);
  if (settings[15] == 'true') {
    $('#records, #session, #session tr, #recordStats>div').css('border', '1px solid white');
    $('#records, #session tr, #recordStats>div').removeClass('mdc-elevation--z1');
  } else {
    $('#records, #session, #session tr, #recordStats>div').css('border', '');
    $('#session tr, #recordStats>div').addClass('mdc-elevation--z1');
    $('#records').addClass('mdc-elevation--z6');
  }
  if (settings[9] != 'None') {
    $('#timer').css('background-image', 'url('+settings[9]+')');
  } else {
    $('#timer').css('background-image', '');
  }
}

function updateSettingsUI() {
  var settings = localStorage.getItem('settings').split('|');
  $('#font').val(settings[2]);
  $('#enableInspection').prop('checked', $.parseJSON(settings[5]));
  $('#enableAudioCues').prop('checked', $.parseJSON(settings[6]));
  $('#enableLongPress').prop('checked', $.parseJSON(settings[7]));
  if ($('#scrambleImage').css('display') == 'none') {
    $('#showscrambleimage').prop('checked', false);
  } else {
    $('#showscrambleimage').prop('checked', true);
  }
  $('#showRecordStats').prop('checked', settings[4] === '');
  $('#hideelements').prop('checked', $.parseJSON(settings[8]));
  $('#bgImage').val(settings[9] === 'None' ? settings[9] : 'Custom');
  $('#theme').val(settings[1]);
  $('input[type=radio][name=colorsMethod]').val([settings[0]]);
  $('#bgcolor').val(settings[10]);
  $('#textcolor').val(settings[11]);
  $('#recordsbgcolor').val(settings[12]);
  $('#sessionbgcolor').val(settings[13]);
  $('#scrambleimagebgcolor').val(settings[14]);
  $('#replaceshadow').prop('checked', $.parseJSON(settings[15]));
  if (settings[0] == 'theme') {
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
  $('#toggleReminders').prop('checked', $.parseJSON(settings[16]));
  $('input:radio[value="'+settings[17]+'"]').prop('checked', true);
  settings[18].split(';').forEach((reminder) => {
    if (reminder.length > 0) {
      $('#newReminder').after(`
        <li class="mdc-list-item mdc-elevation--z1">
          ${reminder}
          <i class="mdc-icon-button mdc-list-item__meta material-icons" data-reminder="${reminder}" onclick="removeReminder(this)">clear</i>
        </li>
      `);
    }
  });
}

updateSettings();
updateSettingsUI();

//Listen for settings changes

selectFont.listen('change', () => {
  var settings = localStorage.getItem('settings').split('|');
  settings[2] = selectFont.value;
  localStorage.setItem('settings', settings.join('|'));
  $('#time h1').css('font-family', settings[2]);
});

$('#enableInspection').change(() => {
  var settings = localStorage.getItem('settings').split('|');
  settings[5] = $('#enableInspection').prop('checked');
  localStorage.setItem('settings', settings.join('|'));
});

$('#enableAudioCues').change(() => {
  var settings = localStorage.getItem('settings').split('|');
  settings[6] = $('#enableAudioCues').prop('checked');
  localStorage.setItem('settings', settings.join('|'));
});

$('#enableLongPress').change(() => {
  var settings = localStorage.getItem('settings').split('|');
  settings[7] = $('#enableLongPress').prop('checked');
  localStorage.setItem('settings', settings.join('|'));
});

$('#showscrambleimage').change(() => {
  var settings = localStorage.getItem('settings').split('|');
  if ($('#showscrambleimage').prop('checked') === true) {
    settings[3] = '';
  } else {
    settings[3] = 'hide';
  }
  localStorage.setItem('settings', settings.join('|'));
  $('#scrambleImage').attr('class', settings[3]);
});

$('#showRecordStats').change(() => {
  var settings = localStorage.getItem('settings').split('|');
  if ($('#showRecordStats').prop('checked') === true) {
    settings[4] = '';
  } else {
    settings[4] = 'hide';
  }
  localStorage.setItem('settings', settings.join('|'));
  $('#recordStats').attr('class', settings[4]);
});

$('#hideelements').change(() => {
  var settings = localStorage.getItem('settings').split('|');
  settings[8] = $(this).prop('checked');
  localStorage.setItem('settings', settings.join('|'));
});

selectBGImage.listen('change', () => {
  var settings = localStorage.getItem('settings').split('|');
  if (selectBGImage.value === 'None') {
    settings[9] = selectBGImage.value;
    localStorage.setItem('settings', settings.join('|'));
    $('#timer').css('background-image', '');
  } else if (selectBGImage.value === 'Choose') {
    chooseBGImageDialog.show();
  } else {
    var imageURL = prompt('Enter image URL');
    console.log(imageURL);
    if (imageURL !== null) {
      settings[9] = imageURL;
      localStorage.setItem('settings', settings.join('|'));
      console.log(imageURL);
      $('#timer').css('background-image', 'url('+imageURL+')');
    } else {
      settings[9] = 'None';
      localStorage.setItem('settings', settings.join('|'));
      $('#timer').css('background-image', '');
      $('#bgImage').val('None');
    }
  }
});

$('#chooseBGImage .mdc-image-list li').click(function() {
  var settings = localStorage.getItem('settings').split('|');
  settings[9] = $(this).attr('data-image');
  localStorage.setItem('settings', settings.join('|'));
  $('#timer').css('background-image', 'url('+settings[9]+')');
  $('#bgImage').val('Custom');
  chooseBGImageDialog.close();
});

$('input:radio[name=colorsMethod]').change(function() {
  var settings = localStorage.getItem('settings').split('|');
  settings[0] = $(this).val();
  localStorage.setItem('settings', settings.join('|'));
  if (settings[0] === 'theme') {
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
  updateSettings();
});

selectTheme.listen('change', () => {
  var settings = localStorage.getItem('settings').split('|');
  settings[1] = selectTheme.value;
  settings[10] = allThemes[settings[1]][0];
  settings[11] = allThemes[settings[1]][1];
  settings[12] = allThemes[settings[1]][2];
  settings[13] = allThemes[settings[1]][3];
  settings[14] = allThemes[settings[1]][4];
  settings[15] = allThemes[settings[1]][5];
  localStorage.setItem('settings', settings.join('|'));
  updateSettings();
  updateSettingsUI();
});

$('#bgcolor').change(() => {
  var settings = localStorage.getItem('settings').split('|');
  settings[10] = $('#bgcolor').val();
  localStorage.setItem('settings', settings.join('|'));
  $('#timer').css('background-color', settings[10]);
});

$('#textcolor').change(() => {
  var settings = localStorage.getItem('settings').split('|');
  settings[11] = $('#textcolor').val();
  localStorage.setItem('settings', settings.join('|'));
  $('.mdc-button--outlined:not(.exception)').css({
    'border-color': settings[11],
    'color': settings[11]
  });
  $('#timer, #records .statsText, #records .statsTextField, #typeOfStats select, #typeOfStats label').css('color', settings[11]);
});

$('#recordsbgcolor').change(() => {
  var settings = localStorage.getItem('settings').split('|');
  settings[12] = $('#recordsbgcolor').val();
  localStorage.setItem('settings', settings.join('|'));
  $('#records').css('background-color', settings[12]);
});

$('#sessionbgcolor').change(() => {
  var settings = localStorage.getItem('settings').split('|');
  settings[13] = $('#sessionbgcolor').val();
  localStorage.setItem('settings', settings.join('|'));
  $('#session').css('background-color', settings[13]);
});

$('#scrambleimagebgcolor').change(() => {
  var settings = localStorage.getItem('settings').split('|');
  settings[14] = $('#scrambleimagebgcolor').val();
  localStorage.setItem('settings', settings.join('|'));
  $('#scrambleImage').css('background-color', settings[14]);
});

$('#replaceshadow').change(() => {
  var settings = localStorage.getItem('settings').split('|');
  settings[15] = $('#replaceshadow').prop('checked');
  localStorage.setItem('settings', settings.join('|'));
  if (settings[15] === true) {
    $('#records, #session, #session tr, #recordStats>div').css('border', '1px solid white');
    $('#records, #session tr, #recordStats>div').removeClass('mdc-elevation--z1');
  } else {
    $('#records, #session, #session tr, #recordStats>div').css('border', '');
    $('#records, #session tr, #recordStats>div').addClass('mdc-elevation--z1');
  }
});

$('#resetColorSettings').click(() => {
  var confirm = prompt('Type in "reset" to reset the color settings');
  if (confirm === 'reset') {
    var settings = localStorage.getItem('settings').split('|');
    settings[0] = 'theme';
    settings[1] = 'Gray Wisp';
    localStorage.setItem('settings', settings.join('|'));
    updateSettings();
    updateSettingsUI();
  }
});

//Reminders
$('#toggleReminders').change(() => {
  var settings = localStorage.getItem('settings').split('|');
  settings[16] = $('#toggleReminders').prop('checked');
  localStorage.setItem('settings', settings.join('|'));
});
$('input:radio[name="reminderType"]').change(() => {
  var settings = localStorage.getItem('settings').split('|');
  settings[17] = $('input:radio[name="reminderType"]:checked').val();
  localStorage.setItem('settings', settings.join('|'));
});

$('#newReminderBtn').click(() => {
  if ($('#reminder').val().length > 0) {
    $('#newReminder').after(`
      <li class="mdc-list-item mdc-elevation--z1">
        ${$('#reminder').val()}
        <i class="mdc-icon-button mdc-list-item__meta material-icons" data-reminder="${$('#reminder').val()}" onclick="removeReminder(this)">clear</i>
      </li>
    `);
    var settings = localStorage.getItem('settings').split('|');
    settings[18] = settings[18].length === 0 ? [] : settings[18].split(';');
    settings[18].push($('#reminder').val());
    settings[18] = settings[18].join(';');
    localStorage.setItem('settings', settings.join('|'));
  }
});

function removeReminder(element) {
  var settings = localStorage.getItem('settings').split('|');
  settings[18] = settings[18].split(';');
  settings[18].splice(settings[18].indexOf($(element).attr('data-reminder')), 1);
  settings[18] = settings[18].join(';');
  console.log(settings[18]);
  localStorage.setItem('settings', settings.join('|'));
  element.parentNode.parentNode.removeChild(element.parentNode);
}
