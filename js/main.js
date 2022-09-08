var config = {
  apiKey: 'AIzaSyA7Vso_wqTgRPORu8hkwHBZNExGWzyJCZ8',
  authDomain: 'cubetastic-33.firebaseapp.com',
  databaseURL: 'https://cubetastic-33.firebaseio.com',
  projectId: 'cubetastic-33',
  storageBucket: 'cubetastic-33.appspot.com',
  messagingSenderId: '984789275247',
};
firebase.initializeApp(config);
var db = firebase.database(), storage = firebase.storage(), messaging = firebase.messaging();

function usernameAvailability(e) {
  $.ajax({
    type: 'POST', url: '/usernameExists', data: {username: e}, success: function (t) {
      console.log(t), 'True' == t ? ($('#username').parent().attr('class', 'outlined-input-field error-input-field'), $('#username ~ .helper-text').text('User with name "' + e + '" already exists!')) : ($('#username').parent().attr('class', 'outlined-input-field success-input-field'), $('#username ~ .helper-text').text('Username "' + e + '" is available!'));
    },
  });
}

function usernameValidity(e) {
  $.ajax({
    type: 'POST', url: '/usernameExists', data: {username: e}, success: function (t) {
      console.log(t), 'True' == t ? ($('#username').parent().attr('class', 'outlined-input-field success-input-field'), $('#username ~ .helper-text').text('User "' + e + '" exists!')) : ($('#username').parent().attr('class', 'outlined-input-field warning-input-field'), $('#username ~ .helper-text').text('User "' + e + '" does not exist!'));
    },
  });
}

function signUpUser(e) {
  e.preventDefault();
  var t = $('#username').val(), a = $('#email').val(), s = $('#password').val(),
    i = ($('#confirmPassword').val(), $('#phone').val()), n = $('#selectLocation').val();
  t.length >= 6 ? usernameAvailability(t) : ($('#username').parent().attr('class', 'outlined-input-field error-input-field'), $('#username ~ .helper-text').text('Username should be at least 6 characters.')), !1 === $('#username').parent().hasClass('error-input-field') && !1 === $('#password').parent().hasClass('error-input-field') ? (snackbar.show({
    message: 'Please wait...',
    timeout: 6e3,
  }), firebase.auth().createUserWithEmailAndPassword(a, s).catch(function (e) {
    var t = e.code;
    e.message;
    'auth/email-already-in-use' == t ? ($('#email').parent().attr('class', 'outlined-input-field error-input-field'), $('#email ~ .helper-text').text('This email address is already in use!')) : 'auth/invalid-email' == t ? ($('#email').parent().attr('class', 'outlined-input-field error-input-field'), $('#email ~ .helper-text').text('Email address is not properly formatted!')) : 'auth/weak-password' == t ? ($('#password').parent().attr('class', 'outlined-input-field error-input-field'), $('#password ~ .helper-text').text('Password is too weak!')) : (console.log(e), snackbar.show({
      message: e,
      multiline: !0,
      timeout: 1e4,
    })), snackbar.show({
      message: 'Please rectify any mistakes in the form!',
      multiline: !0,
      timeout: 1e4,
    });
  }), firebase.auth().onAuthStateChanged(function (e) {
    if (e) {
      e.uid;
      e.updateProfile({
        displayName: t,
        photoURL: '/images/defaultProfilePic.png',
      }), $.ajax({
        type: 'POST',
        url: '/createUser',
        data: {
          uid: e.uid,
          email: a,
          location: n,
          phone: i,
          photoURL: '/images/defaultProfilePic.png',
          username: t,
        },
        success: function (a) {
          console.log(a), a == 'created user ' + t + '.' && e.sendEmailVerification().then(function () {
            alert('Verification email has been sent.'), window.location.href = '/profile';
          }).catch(function (e) {
            console.log(e), snackbar.show({message: e, multiline: !0, timeout: 1e4});
          });
        },
      });
    }
  })) : snackbar.show({message: 'Please rectify any mistakes in the form!', timeout: 1e4});
}

function signInUser(e) {
  e.preventDefault();
  var t = $('#username').val(), a = $('#password').val();
  '' === t ? ($('#username').parent().attr('class', 'outlined-input-field error-input-field'), $('#username ~ .helper-text').text('Please enter your username!')) : (snackbar.show({message: 'Please wait...'}), $('#username').parent().hasClass('warning-input-field') ? snackbar.show({
    message: 'Wrong Username!',
    timeout: 4e3,
  }) : (signedinnow = !0, $.ajax({
    type: 'POST',
    url: '/getEmail',
    data: {username: t},
    success: function (e) {
      firebase.auth().signInWithEmailAndPassword(e, a).then(function (e) {
        window.location.href = '/profile';
      }).catch(function (e) {
        console.log(e), snackbar.show({message: e, multiline: !0, timeout: 1e4});
      });
    },
  })));
}

function signOutUser() {
  firebase.auth().signOut().then(function () {
  }).catch(function (e) {
    console.log(e), console.log(e), snackbar.show({message: e, multiline: !0, timeout: 1e4});
  });
}

window.addEventListener('load', function () {
  $('body').css('background-color', '#FFFFFF');
}), $('#timerDropdownTrigger').hover(function (e) {
  e.preventDefault(), $('#timerDropdown').toggle();
}), $('#signupDivision #username').keyup(function () {
  '' != $(this).val() ? $(this).val().length >= 6 ? usernameAvailability($(this).val()) : ($('#username').parent().attr('class', 'outlined-input-field error-input-field'), $('#username ~ .helper-text').text('Username should be at least 6 characters.')) : ($('#username').parent().attr('class', 'outlined-input-field'), $('#username ~ .helper-text').empty());
}), $('#signupDivision #email').keyup(function () {
  $('#email').parent().attr('class', 'outlined-input-field'), $('#email ~ .helper-text').empty();
}), $('#signupDivision #confirmPassword').keyup(function () {
  $(this).val() == $('#password').val() ? ($('#password').parent().attr('class', 'outlined-input-field success-input-field'), $('#password ~ .helper-text').text('The passwords are matching.')) : ($('#password').parent().attr('class', 'outlined-input-field error-input-field'), $('#password ~ .helper-text').text('The passwords aren\'t matching!'));
}), $('#signinDivision #username').keyup(function () {
  '' != $(this).val() ? usernameValidity($(this).val()) : ($(this).parent().attr('class', 'outlined-input-field'), $('#username ~ .helper-text').empty());
}), signedinnow = !1, $('#forgotPassword').click(function () {
  firebase.auth().sendPasswordResetEmail(prompt('Enter your email address')).then(function () {
    console.log('Sent password reset email.');
  }).catch(function (e) {
    console.log('Error: ', e);
  });
}), messaging.onMessage(function (e) {
  console.log(e), snackbar.show({
    message: e.notification.title,
    timeout: 2e3,
  }), navigator.serviceWorker.register('firebase-messaging-sw.js', {scope: './'}).then(function (t) {
    console.log('Service worker has been registered for scope:' + t.scope);
    var a = {
      body: e.notification.body,
      icon: e.notification.icon,
      vibrate: [100, 50, 100],
      data: {dateOfArrival: Date.now(), primaryKey: 1},
    };
    t.showNotification(e.notification.title, a);
  });
});
