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

window.addEventListener('load', function() {
  $('body').css('background-color', '#FFFFFF');
});

$('#timerDropdownTrigger').hover(function(e) {
  e.preventDefault();
  $('#timerDropdown').toggle();
});

$('#signupDivision #formDiv').submit(signUpUser);
$('#signinDivision #formDiv').submit(signInUser);

$('#signupDivision #username').keyup(function() {
  if ($(this).val() != '') {
    if ($(this).val().length >= 6) {
      usernameAvailability($(this).val());
    } else {
      $('#username').parent().attr('class', 'outlined-input-field error-input-field');
      $('#username ~ .helper-text').text('Username should be at least 6 characters.');
    }
  } else {
    $('#username').parent().attr('class', 'outlined-input-field');
    $('#username ~ .helper-text').empty();
  }
});

$('#signupDivision #email').keyup(function() {
  $('#email').parent().attr('class', 'outlined-input-field');
  $('#email ~ .helper-text').empty();
});

$('#signupDivision #confirmPassword').keyup(function() {
  if ($(this).val() == $('#password').val()) {
    $('#password').parent().attr('class', 'outlined-input-field success-input-field');
    $('#password ~ .helper-text').text('The passwords are matching.');
  } else {
    $('#password').parent().attr('class', 'outlined-input-field error-input-field');
    $('#password ~ .helper-text').text('The passwords aren\'t matching!');
  }
});

$('#signinDivision #username').keyup(function() {
  if ($(this).val() != '') {
    usernameValidity($(this).val());
  } else {
    $(this).parent().attr('class', 'outlined-input-field');
    $('#username ~ .helper-text').empty();
  }
});

function usernameAvailability(usernameGiven) {
  $.ajax({
    type: 'POST',
    url: '/usernameExists',
    data: {
      username: usernameGiven
    },
    success: function(usernameExists) {
      console.log(usernameExists);
      if (usernameExists == 'True') {
        //Username already exists
        $('#username').parent().attr('class', 'outlined-input-field error-input-field');
        $('#username ~ .helper-text').text('User with name "' + usernameGiven + '" already exists!');
      } else {
        //Username is available
        $('#username').parent().attr('class', 'outlined-input-field success-input-field');
        $('#username ~ .helper-text').text('Username "' + usernameGiven + '" is available!');
      }
    }
  });
}

function usernameValidity(usernameGiven) {
  $.ajax({
    type: 'POST',
    url: '/usernameExists',
    data: {
      username: usernameGiven
    },
    success: function(usernameExists) {
      console.log(usernameExists);
      if (usernameExists == 'True') {
        //Username is valid
        $('#username').parent().attr('class', 'outlined-input-field success-input-field');
        $('#username ~ .helper-text').text('User "' + usernameGiven + '" exists!');
      } else {
        //Username is invalid
        $('#username').parent().attr('class', 'outlined-input-field warning-input-field');
        $('#username ~ .helper-text').text('User "' + usernameGiven + '" does not exist!');
      }
    }
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
  if (username.length >= 6) {
    usernameAvailability(username);
  } else {
    $('#username').parent().attr('class', 'outlined-input-field error-input-field');
    $('#username ~ .helper-text').text('Username should be at least 6 characters.');
  }
  if (($('#username').parent().hasClass('error-input-field') === false) && ($('#password').parent().hasClass('error-input-field') === false)) {
    snackbar.show({message: 'Please wait...', timeout: 6000});
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/email-already-in-use') {
        $('#email').parent().attr('class', 'outlined-input-field error-input-field');
        $('#email ~ .helper-text').text('This email address is already in use!');
      } else if (errorCode == 'auth/invalid-email') {
        $('#email').parent().attr('class', 'outlined-input-field error-input-field');
        $('#email ~ .helper-text').text('Email address is not properly formatted!');
      } else if (errorCode == 'auth/weak-password') {
        $('#password').parent().attr('class', 'outlined-input-field error-input-field');
        $('#password ~ .helper-text').text('Password is too weak!');
      } else {
        console.log(error);
        snackbar.show({message: error, multiline: true, timeout: 10000});
      }
      snackbar.show({message: 'Please rectify any mistakes in the form!', multiline: true, timeout: 10000});
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
            photoURL: '/images/defaultProfilePic.png',
            username: username
          },
          success: function(result) {
            console.log(result);
            if (result == 'created user ' + username + '.') {
              user.sendEmailVerification().then(function() {
                alert("Verification email has been sent.");
                window.location.href="/profile";
              }).catch(function(error) {
                console.log(error);
                snackbar.show({message: error, multiline: true, timeout: 10000});
              });
            }
          }
        });
      }
    });
  } else {
    snackbar.show({message: 'Please rectify any mistakes in the form!', timeout: 10000});
  }
}

signedinnow = false;

function signInUser(e) {
  e.preventDefault();
  var username = $('#username').val();
  var password = $('#password').val();
  if (username === '') {
    $('#username').parent().attr('class', 'outlined-input-field error-input-field');
    $('#username ~ .helper-text').text('Please enter your username!');
  } else {
    snackbar.show({message: 'Please wait...'});
    if ($('#username').parent().hasClass('warning-input-field')) {
      snackbar.show({message: 'Wrong Username!', timeout: 4000});
    }
    else {
      signedinnow = true;
      $.ajax({
        type: 'POST',
        url: '/getEmail',
        data: {
          username: username
        },
        success: function(email) {
          firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
            window.location.href="/profile";
          }).catch(function(error) {
            console.log(error);
            snackbar.show({message: error, multiline: true, timeout: 10000});
          });
        }
      });
    }
  }
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
    console.log(error);
    snackbar.show({message: error, multiline: true, timeout: 10000});
  });
}

function isFocused() {
  return document.hasFocus() || document.getElementById('chatIFrame').contentWindow.document.hasFocus();
}

messaging.onMessage(function(payload) {
  snackbar.show({message: payload.notification.title, multiline: true, timeout: 4000});
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
