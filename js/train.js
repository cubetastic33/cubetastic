function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

var algDisplay = document.getElementById('trainScramble');
var us = ["U", "U2", "U'"];

function generatePll() {
  var algCall = random(0, pllAlgs.length);
  $('#trainScramble').html('Scramble: '+pllAlgs[algCall]);
  solution = pllAlgsSol[algCall];
  $('#show').show();
  $('#back').show();
}

function generateOll() {
  var algCall = random(0, ollAlgs.length);
  algDisplay.innerHTML = "Scramble: "+ollAlgs[algCall];
  solution = ollAlgsSol[algCall];
  $('#show').show();
  $('#back').show();
}

function show() {
  $('#show').html(solution);
  $('#show').attr('id', 'showNow');
}

function goBack() {
  $('#reset').html('\
        <div id="trainScramble">\
          <button onclick="generatePll()">PLL scramble</button><br><br>\
          <button onclick="generateOll()">OLL scramble</button><br><br>\
        </div>\
        <br><div id="show" onclick="show()">Show solution</div><br>\
        <div id="back" onclick="goBack()">Back</div>');
  algDisplay = document.getElementById('trainScramble');
}
