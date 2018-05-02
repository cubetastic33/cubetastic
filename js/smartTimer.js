//Initialize firebase
var secondaryAppConfig = {
  apiKey: "AIzaSyD9_8lJ6apiJoZaThp6PsyYbhpKmUaFCek",
  authDomain: "cubetastic-timer.firebaseapp.com",
  databaseURL: "https://cubetastic-timer.firebaseio.com",
  projectId: "cubetastic-timer",
  storageBucket: "cubetastic-timer.appspot.com",
  messagingSenderId: "664695846865"
};

var secondary = firebase.initializeApp(secondaryAppConfig, "secondary");

// Retrieve the database.
var secondaryDatabase = secondary.database();

secondaryDatabase.ref('times').on('value', function(data) {
  $('#solves').empty();
  data.forEach(function(child) {
    $('#solves').append('\
      <div class="card">\
        <p><b>Solve Time: </b>' + child.child('solve_time').val() + '</p>\
        <p><b>Puzzle: </b>' + child.child('puzzle').val() + '</p>\
        <p><b>Scramble: </b>' + child.child('scramble').val() + '</p>\
        <p><b>Solved at time: </b>' + child.child('time').val().substr(0, 19) + '</p>\
      </div>\
    ');
    $('footer').hide();
    window.scrollTo(0, document.body.scrollHeight);
  });
});
