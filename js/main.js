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
var messaging = firebase.messaging();

$(document).ready(function() {
  $('body').css('background-color', 'white');
  if ($('.button-collapse').length) {
    $('.button-collapse').sideNav();
  }
  var sideNavElem = document.querySelectorAll('.sidenav');
  var sideNavInstance = M.Sidenav.init(sideNavElem);
});

$('#timerDropdownTrigger').hover(function(e) {
  e.preventDefault();
  $('#timerDropdown').toggle();
});

$('#signupDivision #formDiv').submit(signUpUser);
$('#signinDivision #formDiv').submit(signInUser);

$('#signupDivision #username').keyup(function() {
  if ($(this).val() != '') {
    if ($(this).val().length > 6) {
      usernameAvailability($(this).val());
    } else {
      $('#username').attr('class', 'browser-default outlined-text-field error-message');
      $('#usernameLabel').attr('class', 'error-message-label');
      $('#username ~ .helper-text').attr('class', 'helper-text error-text');
      $('#username ~ .helper-text').text('Username should be at least 6 characters.');
      $('#username ~ .error-icon').show();
    }
  } else {
    $(this).attr('class', 'browser-default outlined-text-field');
    $('#usernameLabel').attr('class', '');
    $('#username ~ .helper-text').attr('class', 'helper-text');
    $('#username ~ .helper-text').empty();
    $('#username ~ .material-icons').hide();
  }
});

$('#signupDivision #email').keyup(function() {
  $('#email').attr('class', 'browser-default outlined-text-field');
  $('#emailLabel').attr('class', '');
  $('#email ~ .helper-text').attr('class', 'helper-text');
  $('#email ~ .helper-text').empty('');
  $('#email ~ .error-icon').hide();
});

$('#signupDivision #confirmPassword').keyup(function() {
  if ($(this).val() == $('#password').val()) {
    $('#password').attr('class', 'browser-default outlined-text-field');
    $('#passwordLabel').attr('class', '');
    $('#password ~ .helper-text').attr('class', 'helper-text');
    $('#password ~ .helper-text').text('The passwords are matching.');
    $('#password ~ .error-icon').hide();
  } else {
    $('#password').attr('class', 'browser-default outlined-text-field error-message');
    $('#passwordLabel').attr('class', 'error-message-label');
    $('#password ~ .helper-text').attr('class', 'helper-text error-text');
    $('#password ~ .helper-text').text('The passwords aren\'t matching!');
    $('#password ~ .error-icon').show();
  }
});

$('#signinDivision #username').keyup(function() {
  if ($(this).val() != '') {
    usernameValidity($(this).val());
  } else {
    $(this).attr('class', 'browser-default outlined-text-field');
    $('#usernameLabel').attr('class', '');
    $('#username ~ .helper-text').attr('class', 'helper-text');
    $('#username ~ .helper-text').empty();
    $('#username ~ .material-icons').hide();
  }
});

function usernameAvailability(usernameGiven) {
  db.ref('users').on('value', function(data) {
    var i = 0;
    data.forEach(function(user) {
      i++;
      if (usernameGiven == user.child('username').val()) {
        $('#username').attr('class', 'browser-default outlined-text-field error-message');
        $('#usernameLabel').attr('class', 'error-message-label');
        $('#username ~ .helper-text').attr('class', 'helper-text error-text');
        $('#username ~ .helper-text').text('User with name "' + usernameGiven + '" already exists!');
        $('#username ~ .error-icon').show();
      }
      if ((i == data.numChildren()) && ($('#username ~ .helper-text').text() != 'User with name "' + usernameGiven + '" already exists!')) {
        $('#username').attr('class', 'browser-default outlined-text-field');
        $('#usernameLabel').attr('class', '');
        $('#username ~ .helper-text').attr('class', 'helper-text');
        $('#username ~ .helper-text').text('Username "' + usernameGiven + '" is available!');
        $('#username ~ .error-icon').hide();
      }
    });
  });
}

function usernameValidity(usernameGiven) {
  db.ref('users').on('value', function(data) {
    var i = 0;
    data.forEach(function(user) {
      i++;
      if (usernameGiven == user.child('username').val()) {
        $('#username').attr('class', 'browser-default outlined-text-field');
        $('#usernameLabel').attr('class', '');
        $('#username ~ .helper-text').attr('class', 'helper-text');
        $('#username ~ .helper-text').text('User "' + usernameGiven + '" exists.');
        $('#username ~ .warning-icon').hide();
      }
      if ((i == data.numChildren()) && ($('#username ~ .helper-text').text() != 'User "' + usernameGiven + '" exists.')) {
        $('#username').attr('class', 'browser-default outlined-text-field warning-message');
        $('#usernameLabel').attr('class', 'warning-message-label');
        $('#username ~ .helper-text').attr('class', 'helper-text warning-text');
        $('#username ~ .helper-text').text('User "' + usernameGiven + '" does not exist!');
        $('#username ~ .warning-icon').show();
      }
    });
  });
}

function signUpUser(e) {
  e.preventDefault();
  var username = $('#username').val();
  var email = $('#email').val();
  var password = $('#password').val();
  var confPassword = $('#confirmPassword').val();
  var phone = $('#phone').val();
  var location = $('#selectLocation').val();
  if (username.length > 6) {
    usernameAvailability(username);
  } else {
    $('#username').attr('class', 'browser-default outlined-text-field error-message');
    $('#usernameLabel').attr('class', 'error-message-label');
    $('#username ~ .helper-text').attr('class', 'helper-text error-text');
    $('#username ~ .helper-text').text('Username should be at least 6 characters.');
    $('#username ~ .error-icon').show();
  }
  if (($('#username ~ .error-icon').css('display') == 'none') && ($('#password ~ .error-icon').css('display') == 'none')) {
    M.toast({'html': 'Please wait...'});
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/email-already-in-use') {
        $('#email').attr('class', 'browser-default outlined-text-field error-message');
        $('#emailLabel').attr('class', 'error-message-label');
        $('#email ~ .helper-text').attr('class', 'helper-text error-text');
        $('#email ~ .helper-text').text('Email address already in use!');
        $('#email ~ .error-icon').show();
      } else if (errorCode == 'auth/invalid-email') {
        $('#email').attr('class', 'browser-default outlined-text-field error-message');
        $('#emailLabel').attr('class', 'error-message-label');
        $('#email ~ .helper-text').attr('class', 'helper-text error-text');
        $('#email ~ .helper-text').text('Email address not properly formatted!');
        $('#email ~ .error-icon').show();
      } else if (errorCode == 'auth/weak-password') {
        $('#password').attr('class', 'browser-default outlined-text-field error-message');
        $('#passwordLabel').attr('class', 'error-message-label');
        $('#password ~ .helper-text').attr('class', 'helper-text error-text');
        $('#password ~ .helper-text').text('Password is too weak!');
        $('#password ~ .error-icon').show();
      } else {
        M.toast({'html': errorMessage, 'displayLength': 10000});
      }
      M.toast({'html': 'Please rectify any mistakes in the form!'});
    });
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var uid = user.uid;
        user.updateProfile({
          displayName: username,
          photoURL: '/images/defaultProfilePic.png'
        });
        $.ajax({
          type: 'POST',
          url: '/createUser',
          data: {
            uid: user.uid,
            email: email,
            location: location,
            phone: phone,
            username: username
          },
          success: function(result) {
            console.log(result);
            if (result == 'created user ' + username + '.') {
              user.sendEmailVerification().then(function() {
                alert("Verification email has been sent.");
                window.location.href="index.html";
              }).catch(function(error) {
                M.toast({'html': errorMessage, 'displayLength': 10000});
              });
            }
          }
        });
      }
    });
  } else {
    M.toast({'html': 'Please rectify any mistakes in the form!'});
  }
}

function signInUser(e) {
  e.preventDefault();
  var username = $('#username').val();
  var password = $('#password').val();
  M.toast({'html': 'Please wait...', 'displayLength': 10000});
  db.ref('users').on('value', function(data) {
    data.forEach(function(child) {
      if (username == child.child('username').val()) {
        firebase.auth().signInWithEmailAndPassword(child.child('email').val(), password).then(function(user) {
          window.location.href="index.html";
        }).catch(function(error) {
          M.toast({'html': error.message, 'displayLength': 10000});
        });
      }
    });
  });
}

$('#forgotPassword').click(function() {
  firebase.auth().sendPasswordResetEmail(prompt('Enter your email address')).then(function() {
    console.log('Sent password reset email.');
  }).catch(function(error) {
    console.log('Error: ', error);
  });
});

function signOutUser() {
  firebase.auth().signOut().then(function() {}).catch(function(error) {
    console.log(error);
    M.toast({'html': error, 'displayLength': 10000});
  });
}

function isFocused() {
  return document.hasFocus() || document.getElementById('chatIFrame').contentWindow.document.hasFocus();
}

messaging.onMessage(function(payload) {
  M.toast({'html': payload.notification.title, 'displayLength': 3000});
  if (isFocused() == false) {
    navigator.serviceWorker.register('firebase-messaging-sw.js', {
      scope: './'
    }).then(function(reg) {
      console.log('Service worker has been registered for scope:'+ reg.scope);
      var options = {
        body: payload.notification.body,
        icon: payload.notification.icon,
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        }
      };
      reg.showNotification(payload.notification.title, options);
    });
  }
});
