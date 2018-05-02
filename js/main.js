// Initialize Firebase
var config = {
  apiKey: "apiKey",
  authDomain: "authDomain",
  databaseURL: "databaseURL",
  projectId: "projectId",
  storageBucket: "storageBucket",
  messagingSenderId: "messagingSenderId"
};
firebase.initializeApp(config);

var db = firebase.database();
var storage = firebase.storage();

$(document).ready(function() {
  $('body').css('background-color', 'white');
  if ($('.button-collapse').length) {
    $('.button-collapse').sideNav();
  }
  if ($('.carousel.carousel-slider').length) {
    $('.carousel.carousel-slider').carousel({
      duration: 300,
      fullWidth: true
    });
    setInterval(function() {
      $('.carousel').carousel('next');
    }, 2500);
  }
  if ($('select').length) {
    $('select').material_select();
  }
  if ($('.modal').length) {
    $('.modal').modal();
  }
});

$('#timerDropdownTrigger').hover(function(e) {
  e.preventDefault();
  $('#timerDropdown').toggle();
});

$("#signUp").submit(signUpUser);
$("#signIn").submit(signInUser);
$("#signUp #username").keyup(function() {
  if ($("#username").val() != "") {usernameAvailable($("#username").val())} else {$("#msg").html("");$("#msg").hide();}
});

function usernameAvailable(username) {
  var usernameExists;
  var ref = firebase.database().ref("users").orderByChild("username").equalTo(username);
  $('#username').attr('class', 'valid');
  $('#usernameLabel').attr('data-success', username+' is available.');
  ref.on("child_added", function(snapshot) {
    var usersdata = snapshot.val();
    if (usersdata.username == username) {
      $('#username').attr('class', 'invalid');
      $('#usernameLabel').attr('data-error', usersdata.username+' already exists. Choose a different name!');
      usernameExists = true;
    } else {
      usernameExists = false;
    }
  });
}

function signUpUser(e) {
  e.preventDefault();
  //Get values
  var username = $("#username").val();
  var email = $("#email").val();
  var password = $("#password").val();
  var confPassword = $("#confPassword").val();
  var location = $("#locationSelector").find(":selected").val();
  if ((1 === 1) && (password == confPassword)) {
    Materialize.toast('Please wait...');
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        $('#password').attr('class', 'invalid');
        $('#passwordLabel').attr('data-error', 'The password is too weak.');
      }
      else {
        Materialize.toast(errorMessage, 10000);
      }
    });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        db.ref('users/'+uid).child('email').set(email);
        db.ref('users/'+uid).child('location').set(location);
        db.ref('users/'+uid).child('profilePic').set('/images/defaultProfilePic.png');
        db.ref('users/'+uid).child('username').set(username);
        user.sendEmailVerification().then(function() {
          // Email sent.
          alert("Verification email has been sent.");
          window.location.href="index.html";
        }).catch(function(error) {
          // An error happened.
          Materialize.toast(errorMessage, 10000);
        });
      }
    });
  } else if (password != confPassword) {
    $('#confPassword').attr('class', 'invalid');
    $('#confPasswordLabel').attr('data-error', 'The two passwords don\'t match!');
  }
}

function signInUser(e) {
  e.preventDefault();
  //Get values
  var username = $('#username').val();
  var password = $('#password').val();
  Materialize.toast('Please wait...', 10000);
  var usersRef = db.ref('users').orderByChild('username').equalTo(username);
  usersRef.once('child_added', function(snapshot) {
    email = snapshot.val().email;
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
      window.location.href="index.html";
    }).catch(function(error) {
      // Handle Errors here.
      if (error.code === 'auth/wrong-password') {
        $('#password').attr('class', 'invalid');
        $('#passwordLabel').attr('data-error', 'Wrong password or username!');
      } else {
        Materialize.toast(error.message, 10000);
      }
    });
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}

function signOutUser() {
  firebase.auth().signOut().then(function() {}).catch(function(error) {
    console.log(error);
    Materialize.toast(error, 10000);
  });
}

function dismiss() {
  $('#loginMessage').hide();
}
