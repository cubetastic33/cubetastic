function puzzlesLoaded(puzzles) {
  window.puzzles = puzzles;
  showScramble($('#cubeTypeSelect').val());
}

function showScramble(type) {
  $('#scramble').text('Scramble: ');
  var generatedScramble = puzzles[type].generateScramble();
  $('#scramble').append(generatedScramble);
  /*var maxWidth = 0;
  var maxHeight = 0;
  var svgText = tnoodlejs.scrambleToSvg(generatedScramble, type, maxWidth, maxHeight);
  $('#scrambleImage').html(svgText);*/
}

$('#cubeTypeSelect').change(function() {
  showScramble($('#cubeTypeSelect').val());
});
