//Timer code

var stopped = false;
var timerRunning = false;
var timerStartTime = 0;
var startDelayTimer = false;
var inspectionClearance = false;

var entireTimerDiv = document.getElementById('timer');
var el = document.getElementById('time');
el.addEventListener("touchstart", handleStart, false);
el.addEventListener("touchend", handleEnd, false);
entireTimerDiv.addEventListener("touchstart", handleFullStart, false);
entireTimerDiv.addEventListener("touchend", handleFullEnd, false);

var solveInfoDialog = new mdc.dialog.MDCDialog(document.querySelector('#solveInfoDialog'));
var snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));

$(window).keydown(function(e) {
  if (timerRunning == true) {
    //Stop the timer
    clearInterval(startedTimer);
    stopped = true;
    timerRunning = false;
    clearInterval(startedBlinking);
    saveTime($('#time h1').text(), $('#selectSession + div ul').attr('data-selected'), $('#previousScramble').html().split('Scramble: ')[1], $('#selectCategory').text(), false);
  }
  if (typeof inspectionTimeout != 'undefined') {
    clearTimeout(inspectionTimeout);
    inspectionClearance = false;
  }
  if (e.keyCode == 32) {
    //This will fire every time the user presses the spacebar
    e.preventDefault();
    //This is so that the page doesn't scroll
    if ((timerRunning == false) && (stopped == false)) {
      //Stop inspection if running
      if (typeof inspectionTimeout != 'undefined') {
        inspectionClearance = true;
        inspectionTimeout = undefined;
      }
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
    saveTime($('#time h1').text(), $('#selectSession + div ul').attr('data-selected'), $('#previousScramble').html().split('Scramble: ')[1], $('#selectCategory').text(), false);
  }
  if (typeof inspectionTimeout != 'undefined') {
    clearTimeout(inspectionTimeout);
    inspectionClearance = false;
  }
}

function handleStart(e) {
  e.preventDefault();
  if ((timerRunning == false) && (stopped == false)) {
    //Stop inspection if running
    if (typeof inspectionTimeout != 'undefined') {
      inspectionClearance = true;
      inspectionTimeout = undefined;
    }
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
      //Start the timer.
      if (($('#enableInspection').prop('checked') == true) && (inspectionClearance === false)) {
        inspection();
        if ($('#hideelements').prop('checked') == true) {
          $('#records, #session, .button-group, #scrambleImage, .mdc-fab').hide();
        }
      } else {
        if (typeof inspectionTimeout != 'undefined') {
          clearTimeout(inspectionTimeout);
        }
        var date = new Date();
        timerStartTime = date.getTime().toString();
        window.startedTimer = setInterval(timer, 10);
        inspectionClearance = false;
        $('#red').attr('class', '');
        $('#green').attr('class', '');
        window.startedBlinking = setInterval(blink, 200);
        $('#previousScramble').html($('#scramble').html());
        $('#scramble').html('');
        if ($('#hideelements').prop('checked') == true) {
          $('#records, #session, .button-group, #scrambleImage, .mdc-fab').hide();
        }
      }
    } else {
      if ($('#hideelements').prop('checked') == true) {
        $('#records, #session, .button-group, #scrambleImage, .mdc-fab').show();
        $('#installFAB, #infoFAB, #settingsFAB, #feedbackFAB').hide();
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
      $('#records, #session, .button-group , #scrambleImage, .mdc-fab').show();
      $('#installFAB, #infoFAB, #settingsFAB, #feedbackFAB').hide();
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
    $('#selectSession, #selectCategory, #editTimeBtn, .mdc-fab').show();
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
  startDelayTimer = false;
  clearTimeout(showGreenTimeout);
  if ((stopped == false) && ($('#green').hasClass('green') == true)) {
    //Start the timer.
    if (($('#enableInspection').prop('checked') == true) && (inspectionClearance === false)) {
      inspection();
      if ($('#hideelements').prop('checked') == true) {
        $('.button-group, .mdc-fab').hide();
      }
    } else {
      var date = new Date();
      timerStartTime = date.getTime().toString();
      window.startedTimer = setInterval(timer, 10);
      inspectionClearance = false;
      $('#red').attr('class', '');
      $('#green').attr('class', '');
      window.startedBlinking = setInterval(blink, 200);
      $('#previousScramble').html($('#scramble').html());
      $('#scramble').html('');
      if ($('#hideelements').prop('checked') == true) {
        console.log('hwiefu0hDHIHIOFWHQhoidhoiefh');
        $('.button-group, .mdc-fab').hide();
      }
    }
  } else {
    if ($('#hideelements').prop('checked') == true) {
      $('.button-group, .mdc-fab').show();
      $('#installFAB, #infoFAB, #settingsFAB, #feedbackFAB').hide();
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
    plus_two = true;
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
  if (firebase.auth().currentUser) {
    $.ajax({
      type: 'POST',
      url: '/saveTime',
      data: {
        uid: firebase.auth().currentUser.uid,
        time: time,
        session: session,
        scramble: scramble,
        category: category,
        plus_two: plusTwo
      },
      success: function(result) {
        console.log(result);
      }
    });
  } else {
    var times = database.transaction(['times'], 'readwrite').objectStore('times');
    times.add({session: session, time: time, scramble: scramble, category: category, plusTwo: plusTwo});
    showTimesFromIndexedDB();
  }
}

//Other code

var selectedSession = parseInt(localStorage.getItem('selectedSession'));
var sessionNames = JSON.parse(localStorage.getItem('sessionNames'));
var selectedCategory = localStorage.getItem('selectedCategory');
var category = {'3x3x3': '333', '2x2x2': '222', '3x3x3 bld': '333ni', 'Pyraminx': 'pyram', '4x4x4': '444', '5x5x5': '555', '6x6x6': '666', '7x7x7': '777', 'Megaminx': 'minx', 'Skewb': 'skewb', 'Square 1': 'sq1fast'}

if (selectedCategory == null) {
  localStorage.setItem('selectedSession', '1');
  selectedSession = 1;
  localStorage.setItem('sessionNames', JSON.stringify(['Session 1', 'Session 2', 'Session 3', 'Session 4', 'Session 5', 'Session 6', 'Session 7', 'Session 8', 'Session 9', 'Session 10']));
  sessionNames = JSON.parse(localStorage.getItem('sessionNames'));
  localStorage.setItem('selectedCategory', '3x3x3');
  selectedCategory = '3x3x3';
}

$('#selectSession + div ul').attr('data-selected', selectedSession);
for (var i=0; i<sessionNames.length; i++) {
  $('#selectSession + div ul li:nth-child(' + (i+1) + ')').text(sessionNames[i]);
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
$('#editSessionName').click(function() {
  var newName = prompt('Enter a new name for the selected session');
  sessionNames[selectedSession-1] = newName;
  localStorage.setItem('sessionNames', JSON.stringify(sessionNames));
    $('#selectSession + div ul li:nth-child(' + (selectedSession) + '), #selectSession').text(newName);
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

function showTimesFromFirebase() {
  db.ref('/times/'+firebase.auth().currentUser.uid+'/session'+$('#selectSession + div ul').attr('data-selected')).on('value', function(data) {
    $('#session, #sessionTimesTable').html('\
      <table>\
        <thead><tr class="mdc-elevation--z3"><th>S. No</th><th>Time</th><th>Ao5</th></tr></thead>\
        <tbody>\
        </tbody>\
      </table>\
    ');
    var n = 0;
    var timesForAvg5 = [];
    var timesForAvg12 = [];
    var timesForAvg50 = [];
    var timesForAvg100 = [];
    var pb = '-:--.---';
    data.forEach(function(solve) {
      n++;
      var pt = solve.val().time;
      var time = solve.val().time;
      if (solve.val().plusTwo == 'true') {
        pt = pt.split(':')[0] + ':' + (parseInt(pt.split(':')[1].split('.')[0])+2).toString() + '.' + pt.split('.')[1] + '+';
        time = time.split(':')[0] + ':' + (parseInt(time.split(':')[1].split('.')[0])+2).toString() + '.' + time.split('.')[1];
      } else if (solve.val().plusTwo == 'DNF') {
        pt = 'DNF';
        time = time + '(DNF)';
        timesForAvg5.push(0);
        timesForAvg12.push(0);
        timesForAvg50.push(0);
        timesForAvg100.push(0);
      }
      if (solve.val().plusTwo != 'DNF') {
        timesForAvg5.push((parseInt(time.split(':')[0])*60) + parseFloat(time.split(':')[1]));
        timesForAvg12.push((parseInt(time.split(':')[0])*60) + parseFloat(time.split(':')[1]));
        timesForAvg50.push((parseInt(time.split(':')[0])*60) + parseFloat(time.split(':')[1]));
        timesForAvg100.push((parseInt(time.split(':')[0])*60) + parseFloat(time.split(':')[1]));
        if (pb == '-:--.---' || (parseInt(time.split(':')[0])*60) + parseFloat(time.split(':')[1]) < pb) {pb = (parseInt(time.split(':')[0])*60) + parseFloat(time.split(':')[1])}
      }
      var avg5 = '-:--.---';
      var avg12 = '-:--.---';
      var avg50 = '-:--.---';
      var avg100 = '-:--.---';
      if (timesForAvg5.length == 5) {
        avg5 = (timesForAvg5.reduce(add, 0) - Array.min(timesForAvg5) - Array.max(timesForAvg5))/3;
        var minutes = Math.floor(avg5/60);
        avg5 = minutes + ':' + (avg5%60).toString().split('.')[0] + '.' + (avg5%60).toString().split('.')[1].substr(0, 3);
        timesForAvg5.shift();
      }
      if (timesForAvg12.length == 12) {
        avg12 = (timesForAvg12.reduce(add, 0) - Array.min(timesForAvg12) - Array.max(timesForAvg12))/12;
        var minutes = Math.floor(avg12/60);
        avg12 = minutes + ':' + (avg12%60).toString().split('.')[0] + '.' + (avg12%60).toString().split('.')[1].substr(0, 3);
        timesForAvg12.shift();
      }
      if (timesForAvg50.length == 50) {
        avg50 = (timesForAvg50.reduce(add, 0) - Array.min(timesForAvg50) - Array.max(timesForAvg50))/50;
        var minutes = Math.floor(avg50/60);
        avg50 = minutes + ':' + (avg50%60).toString().split('.')[0] + '.' + (avg50%60).toString().split('.')[1].substr(0, 3);
        timesForAvg50.shift();
      }
      if (timesForAvg100.length == 100) {
        avg100 = (timesForAvg100.reduce(add, 0) - Array.min(timesForAvg100) - Array.max(timesForAvg100))/100;
        var minutes = Math.floor(avg100/60);
        avg100 = minutes + ':' + (avg100%60).toString().split('.')[0] + '.' + (avg100%60).toString().split('.')[1].substr(0, 3);
        timesForAvg100.shift();
      }
      $('#session table tbody, #sessionTimesTable table tbody').append('\
        <tr class="mdc-elevation--z3" data-key="'+solve.key+'" data-time="'+time+
        '" data-scramble="'+solve.val().scramble+'" data-category="'+solve.val().category+
        '" data-plus-two="'+solve.val().plusTwo+'"><td>'+n+'</td><td>'+pt+
        '</td><td>'+avg5+'</td></tr>\
      ');
      $('#records, #recordsTable').html('\
        <b>PB: </b>'+Math.floor(pb/60)+':'+(pb%60).toString()+'<br>\
        <b>Avg of 5: </b>'+avg5+'<br>\
        <b>Avg of 12: </b>'+avg12+'<br>\
        <b>Avg of 50: </b>'+avg50+'<br>\
        <b>Avg of 100: </b>'+avg100+'<br>\
      ');
      document.querySelector('#session').scrollTo(0, document.querySelector('#session').scrollHeight);
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
      <thead><tr class="mdc-elevation--z3"><th>S. No</th><th>Time</th><th>Ao5</th></tr></thead>\
      <tbody>\
      </tbody>\
    </table>\
  ');
  var n = 0;
  var timesForAvg5 = [];
  var timesForAvg12 = [];
  var timesForAvg50 = [];
  var timesForAvg100 = [];
  var pb = '-:--.---';
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
        timesForAvg5.push((parseInt(time.split(':')[0])*60) + parseFloat(time.split(':')[1]));
        timesForAvg12.push((parseInt(time.split(':')[0])*60) + parseFloat(time.split(':')[1]));
        timesForAvg50.push((parseInt(time.split(':')[0])*60) + parseFloat(time.split(':')[1]));
        timesForAvg100.push((parseInt(time.split(':')[0])*60) + parseFloat(time.split(':')[1]));
        var avg5 = '-:--.---';
        var avg12 = '-:--.---';
        var avg50 = '-:--.---';
        var avg100 = '-:--.---';
        if (pb == '-:--.---' || (parseInt(time.split(':')[0])*60) + parseFloat(time.split(':')[1]) < pb) {pb = (parseInt(time.split(':')[0])*60) + parseFloat(time.split(':')[1])}
        if (timesForAvg5.length == 5) {
          avg5 = (timesForAvg5.reduce(add, 0) - Array.min(timesForAvg5) - Array.max(timesForAvg5))/3;
          var minutes = Math.floor(avg5/60);
          avg5 = minutes + ':' + (avg5%60).toString().split('.')[0] + '.' + (avg5%60).toString().split('.')[1].substr(0, 3);
          timesForAvg5.shift();
        }
        if (timesForAvg12.length == 12) {
          avg12 = (timesForAvg12.reduce(add, 0) - Array.min(timesForAvg12) - Array.max(timesForAvg12))/12;
          var minutes = Math.floor(avg12/60);
          avg12 = minutes + ':' + (avg12%60).toString().split('.')[0] + '.' + (avg12%60).toString().split('.')[1].substr(0, 3);
          timesForAvg12.shift();
        }
        if (timesForAvg50.length == 50) {
          avg50 = (timesForAvg50.reduce(add, 0) - Array.min(timesForAvg50) - Array.max(timesForAvg50))/50;
          var minutes = Math.floor(avg50/60);
          avg50 = minutes + ':' + (avg50%60).toString().split('.')[0] + '.' + (avg50%60).toString().split('.')[1].substr(0, 3);
          timesForAvg50.shift();
        }
        if (timesForAvg100.length == 100) {
          avg100 = (timesForAvg100.reduce(add, 0) - Array.min(timesForAvg100) - Array.max(timesForAvg100))/100;
          var minutes = Math.floor(avg100/60);
          avg100 = minutes + ':' + (avg100%60).toString().split('.')[0] + '.' + (avg100%60).toString().split('.')[1].substr(0, 3);
          timesForAvg100.shift();
        }
        $('#session table tbody, #sessionTimesTable table tbody').append('\
          <tr class="mdc-elevation--z3" data-key="'+cursor.primaryKey+'" data-time="'+cursor.value.time+
          '" data-scramble="'+cursor.value.scramble+'" data-category="'+cursor.value.category+
          '" data-plus-two="'+cursor.value.plusTwo+'"><td>'+n+'</td><td>'+time+pt+
          '</td><td>'+avg5+'</td></tr>\
        ');
        $('#records, #recordsTable').html('\
          <b>PB: </b>'+Math.floor(pb/60)+':'+(pb%60).toString()+'<br>\
          <b>Avg of 5: </b>'+avg5+'<br>\
          <b>Avg of 12: </b>'+avg12+'<br>\
          <b>Avg of 50: </b>'+avg50+'<br>\
          <b>Avg of 100: </b>'+avg100+'<br>\
        ');
        document.querySelector('#session').scrollTo(0, document.querySelector('#session').scrollHeight);
      }
      cursor.continue();
    }
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
    var key = $('#session table tbody tr:last-child').attr('data-key');
    if (firebase.auth().currentUser) {
      deleteTimeFromFirebase(key);
    } else if ($('#session table tbody tr:last-child').attr('data-key')) {
      deleteTimeFromIndexedDb(parseInt(key));
    }
  } else if (e.shiftKey && e.which == 50) {
    //shift + 2 => toggle last solve as +2
    var primaryKey = $('#session table tbody tr:last-child').attr('data-key');
    if (firebase.auth().currentUser) {
      plusTwoTimeFromFirebase(primaryKey);
    } else {
      plusTwoTimeFromIndexedDB(parseInt(primaryKey));
    }
  } else if (e.shiftKey && e.which == 68) {
    //shift + D => set last solve as DNF
    var primaryKey = $('#session table tbody tr:last-child').attr('data-key');
    if (firebase.auth().currentUser) {
      DNFTimeFromFirebase(primaryKey);
    } else {
      DNFTimeFromIndexedDB(parseInt(primaryKey));
    }
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
  });
}

function initMobileContextMenu() {
  $('#sessionTimesTable tr').off().on('contextmenu', function(e) {
    var primaryKey = $(this).attr('data-key');
    var time = $(this).attr('data-time');
    var scramble = $(this).attr('data-scramble');
    var category = $(this).attr('data-category');
    var plusTwo = $(this).attr('data-plus-two');
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
  localStorage.setItem('inspectionEnabled', false);
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
var inspectionEnabled = $.parseJSON(localStorage.getItem('inspectionEnabled'));
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
$('#timer').css({
  'background-color': bgcolor,
  'color': textcolor
});
$('.mdc-button--outlined').css({
  'border-color': textcolor,
  'color': textcolor
});
$('#records').css('background-color', recordsbgcolor);
$('#session').css('background-color', sessionbgcolor);
$('#scrambleImage').css('background-color', scrambleimagebgcolor);
if (replaceshadow == true) {
  $('#records, #session, tr').css('border', '1px solid white');
  $('#records, #session tr').removeClass('mdc-elevation--z4');
} else {
  $('#records, #session, tr').css('border', '');
  $('#records, #session tr').addClass('mdc-elevation--z4');
}

if (bgImage != 'None') {
  $('#timer').css('background-image', 'url('+ bgImage +')');
} else {
  $('#timer').css('background-image', '');
}

//Update settings selectors

$('#font').val(font);
$('#enableInspection').prop('checked', inspectionEnabled);
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

selectBGImage.listen('change', function() {
  if (selectBGImage.value === 'None') {
    localStorage.setItem('bgImage', selectBGImage.value);
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
  $('#timer').css('color', textcolor);
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
