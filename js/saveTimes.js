firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    $('#listTimes, #listRecords, #controlPanel a').show();
    $('#loginMessage').hide();
    showTimes();
  } else {
    $('#listTimes, #listRecords, #controlPanel a').hide();
    $('#loginMessage').show();
  }
});

(function(){
  var attachEvent = document.attachEvent;
  var isIE = navigator.userAgent.match(/Trident/);
  var requestFrame = (function(){
    var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function(fn){ return window.setTimeout(fn, 20); };
    return function(fn){ return raf(fn); };
  })();
  
  var cancelFrame = (function(){
    var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
           window.clearTimeout;
    return function(id){ return cancel(id); };
  })();
  
  function resizeListener(e){
    var win = e.target || e.srcElement;
    if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
    win.__resizeRAF__ = requestFrame(function(){
      var trigger = win.__resizeTrigger__;
      trigger.__resizeListeners__.forEach(function(fn){
        fn.call(trigger, e);
      });
    });
  }
  
  function objectLoad(e){
    this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
    this.contentDocument.defaultView.addEventListener('resize', resizeListener);
  }
  
  window.addResizeListener = function(element, fn){
    if (!element.__resizeListeners__) {
      element.__resizeListeners__ = [];
      if (attachEvent) {
        element.__resizeTrigger__ = element;
        element.attachEvent('onresize', resizeListener);
      }
      else {
        if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
        var obj = element.__resizeTrigger__ = document.createElement('object'); 
        obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
        obj.__resizeElement__ = element;
        obj.onload = objectLoad;
        obj.type = 'text/html';
        if (isIE) element.appendChild(obj);
        obj.data = 'about:blank';
        if (!isIE) element.appendChild(obj);
      }
    }
    element.__resizeListeners__.push(fn);
  };
  
  window.removeResizeListener = function(element, fn){
    element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
    if (!element.__resizeListeners__.length) {
      if (attachEvent) element.detachEvent('onresize', resizeListener);
      else {
        element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
        element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
      }
    }
  }
})();

var myElement = document.getElementById('listTimes'),
myResizeFn = function() {
  console.log($('#listTimes').outerWidth());
  $('#scramblePanel').css('margin-left', ($('#listTimes').outerWidth() + 10));
};
//addResizeListener(myElement, myResizeFn);

function mobileShowTimes() {
  $('#listTimes .selectSession').val($('#mobileListTimes .selectSession').find(':selected').val());
  showTimes();
}

function showTimes() {
  $('#mobileListTimes .selectSession').val($('#listTimes .selectSession').find(':selected').val());
  showRecords();
  var uid = firebase.auth().currentUser.uid;
  var session = $('#listTimes .selectSession').find(':selected').val();
  var timesRef = db.ref('times/'+uid+'/'+session);
  timesRef.on('value', function(snapshot) {
    console.log(snapshot.val());
    var num = 1;
    $('#listTimes .timesList').html('\
    <table class="timesTable">\
    <tr>\
    <th>No.</th>\
    <th>Time</th>\
    <th>Avg. of 5</th>\
    </tr>\
    </table>');
    $('#mobileListTimes .timesList').empty();
    var table = document.getElementsByClassName('timesTable')[0];
    var times = [];
    var avg5 = '-:--.---';
    snapshot.forEach(function(child) {
      for (var i = 0; i < 3; i++) {
        if (i === 0) {
          var row = table.insertRow();
          var stringId = child.key;
          $(row).attr('id', stringId);
          var cell = row.insertCell();
          cell.innerHTML = num;
        } else if (i === 1) {
          var cell = row.insertCell();
          cell.innerHTML = child.val().time;
          var minutes = parseInt(child.val().time.split(':')[0]);
          var min = minutes*60000;
          var seconds = parseInt(child.val().time.split(':')[1].split('.')[0]);
          var sec = seconds*1000;
          var milliseconds = parseInt(child.val().time.split('.')[1]);
          times.push(min + sec + milliseconds);
        } else {
          if (times.length >= 5) {
            var rawMs = (times[0] + times[1] + times[2] + times[3] + times[4] - Array.min(times) - Array.max(times))/3;
            var minutes = parseInt(rawMs/60000).toString();
            var seconds = parseInt((rawMs%60000)/1000).toString();
            var milliseconds = (rawMs%1000).toString().split('.')[0].substr(0, 3);
            avg5 = minutes+':'+seconds+'.'+milliseconds;
            removeFromArray(times, times[0]);
          }
          var cell = row.insertCell();
          cell.innerHTML = avg5;
        }
      }
      $('#mobileListTimes .timesList').html($('#listTimes .timesList').html());
      $('#listTimes .timesList').scrollTop($('#timesList')[0].scrollHeight);
      $('#mobileListTimes .timesList').scrollTop($('#mobileListTimes .timesList')[0].scrollHeight);
      num++;
    });
    $('#listTimes .timesTable tr').contextmenu(function(e) {
      e.preventDefault();
      var objId = this;
      $('#context-menu').show();
      $('#context-menu').css({
        "left": e.pageX + 'px',
        "top": e.pageY + 'px'});
        $('#deleteTime').click(function() {
          var id = $(objId).attr('id');
          db.ref('times/'+firebase.auth().currentUser.uid).on('value', function(data) {
            data.forEach(function(child) {
              db.ref('times/'+firebase.auth().currentUser.uid+'/'+child.key).child(id).remove().catch(function(err) {
                console.log('Error: ', err);
            });
          });
        });
      });
      $('#viewScramble').click(function() {
        var id = $(objId).attr('id');
        db.ref('times/'+firebase.auth().currentUser.uid).on('value', function(data) {
          data.forEach(function(child) {
            db.ref('times/'+firebase.auth().currentUser.uid+'/'+child.key).child(id).on('value', function(snapshot) {
              $('#context-menu').hide();
              $('#viewScrambleDiv');
              $('#viewScrambleDiv .modal-content').html(snapshot.val().scramble);
            });
          });
        });
      });
    });
    $(window).click(function() {
      $('#context-menu').hide();
      $('#viewScrambleDiv').closeModal();
    });
  });
}

function saveTime(time) {
  var uid = firebase.auth().currentUser.uid;
  var session = $('#listTimes .selectSession').find(':selected').val();
  var scramble = $('#oldScramble').text().substr(10);
  var newTimeRef = db.ref('times/'+uid+'/'+session).push();
  newTimeRef.child('time').set(time);
  newTimeRef.child('scramble').set(scramble);
}

Array.max = function( array ){
  return Math.max.apply( Math, array );
};

Array.min = function( array ){
 return Math.min.apply( Math, array );
};

function removeFromArray(array, element) {
  const index = array.indexOf(element);
  array.splice(index, 1);
}

function showRecords() {
  var uid = firebase.auth().currentUser.uid;
  var session = $('#listTimes .selectSession').find(':selected').val();
  var timesRef = db.ref('times/'+uid+'/session'+session);
  timesRef.on('value', function(snapshot) {
    var times = [];
    var avg5 = 0;
    var lastAvg5 = 0;
    var num = 0;
    snapshot.forEach(function(child) {
      var minutes = parseInt(child.val().time.split(':')[0])*60000;
      var seconds = parseInt(child.val().time.split(':')[1].split('.')[0])*1000;
      var milliseconds = parseInt(child.val().time.split('.')[1]);
      var currentTime = minutes + seconds + milliseconds;
      times.push(currentTime);
      if (times.length >= 5) {
        var rawMs = (times[0] + times[1] + times[2] + times[3] + times[4] - Array.min(times) - Array.max(times))/3;
        var minutes = parseInt(rawMs/60000).toString();
        var seconds = parseInt((rawMs%60000)/1000).toString();
        var milliseconds = (rawMs%1000).toString().split('.')[0].substr(0, 3);
        avg5 = minutes+':'+seconds+'.'+milliseconds;
        removeFromArray(times, times[0]);
      }
      if (num == 0) {
        lastTime = currentTime;
        $('.pb').html('<h4>PB: </h4>'+child.val().time);
      }
      if (num == 5) {
        lastAvg5 = avg5;
      }
      if (lastTime > currentTime) {
        $('.pb').html('<h4>PB: </h4>'+child.val().time);
        lastTime = currentTime;
      }
      if (lastAvg5 > avg5) {
        $('.ao5').html('<h4>Best average of 5: </h4>'+avg5);
        lastAvg5 = avg5;
      }
      num++;
      $('.numOfSolves').html('<h4>No. of solves found: </h4>'+num);
    });
  });
}
