firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    $('.signedout').hide();
    $('.signedin').show();
    var uid = user.uid;
    db.ref('users/' + uid).on('value', function (data) {
      photoURL = data.child('profilePic').val();
      $('.username').text(user.displayName);
      $('.email').text(user.email);
      $('.phone').text(data.val().phone);
      $('.location').text(data.val().location);
      $('#selectLocation').val(data.val().location);
      $('.bio').text(data.val().bio);
      $('#bio').val(data.val().bio);
      $('#userPhoto').attr('src', photoURL);
      $('#userPhoto').click(function () {
        $('#updateProfilePic').click();
      });
      $('#updateProfilePic').change(function (e) {
        var newProfilePic = e.target.files[0];
        console.log('Chose new file', newProfilePic);
        if (!['png', 'jpeg', 'jpg', 'gif'].includes(newProfilePic.name.slice((newProfilePic.name.lastIndexOf('.') - 1 >>> 0) + 2))) {
          snackbar.show({message: 'Please select a png or jpeg/jpg or gif file!'});
        }
        storage.ref('profile-pics/' + user.displayName).put(newProfilePic).then(function () {
          var imageRef = storage.ref('profile-pics/' + user.displayName);
          imageRef.getDownloadURL().then(function (url) {
            user.updateProfile({'photoURL': url});
            $.ajax({
              type: 'POST',
              url: '/updateProfilePic',
              data: {uid: user.uid, profilePic: url},
              success: function (result) {
                console.log(result);
                if (result == 'updated profile pic to ' + url + '.') {
                  snackbar.show({message: 'Profile pic updated successfully!', timeout: 4000});
                  $('#cancelButton').prop('disabled', true);
                  $('#doneButton').prop('disabled', false);
                }
              },
            });
          });
        });
      });
    });
    db.ref('users/' + user.uid).on('value', function (data) {
    });
  } else {
    $('.signedin').hide();
    $('.signedout').show();
  }
});
mdc.ripple.MDCRipple.attachTo(document.querySelector('#reauthenticateButton'));
mdc.ripple.MDCRipple.attachTo(document.querySelector('#updateNumber'));
mdc.ripple.MDCRipple.attachTo(document.querySelector('#updateLocation'));
mdc.ripple.MDCRipple.attachTo(document.querySelector('#updateBio'));
mdc.textField.MDCTextField.attachTo(document.querySelector('.mdc-text-field--textarea'));
$('#phone').focusin(function () {
  $('#phone ~ label').animate({'fontSize': '0.8rem', 'top': '-0.7rem', 'padding': '0 0.25rem'}, 80);
});
$('#phone').focusout(function () {
  if ($(this).val() === '') {
    $('#phone ~ label').animate({'fontSize': '1rem', 'top': '1rem', 'padding': 0}, 80);
  }
});
$('#selectLocation').change(function () {
  $('#selectLocation ~ label').animate({
    'fontSize': '0.8rem',
    'top': '-0.7rem',
    'padding': '0 0.25rem',
  }, 80);
});
$('#selectLocation').focusout(function () {
  if ($(this).val() === null) {
    $('#selectLocation ~ label').animate({'fontSize': '1rem', 'top': '1rem', 'padding': 0}, 80);
  }
});
var dialog = new mdc.dialog.MDCDialog(document.querySelector('#reauthenticate'));
var phoneDialog = new mdc.dialog.MDCDialog(document.querySelector('#updatePhoneNumber'));
var locationDialog = new mdc.dialog.MDCDialog(document.querySelector('#updateLocationDialog'));
var bioDialog = new mdc.dialog.MDCDialog(document.querySelector('#updateBioDialog'));

function resetReauthenticationDialog() {
  $('#doneButton').prop('disabled', true);
  $('.mdc-list-item:nth-child(2) i.mdc-list-item__meta').html('lock');
  $('.mdc-list-item:nth-child(3) i.mdc-list-item__meta').html('lock');
  $('#reauthenticateBody').html(`You are attempting to change sensitive data which is currently locked. To unlock it, please reauthenticate by entering your password below:<div class="outlined-input-field"style="margin-top: 1rem"><i class="material-icons">lock</i><input type="password"id="password"class="outlined-text-field"autocomplete="off"readonly onfocus="if (this.hasAttribute('readonly')) {this.removeAttribute('readonly');this.blur();this.focus();}"><label for="password"style="background-color: #FFFFFF">Password</label></div><br><button id="reauthenticateButton"class="mdc-button mdc-button--raised">Reauthenticate</button>`);
  $('#password').focusin(function () {
    $('#password ~ label').animate({
      'fontSize': '0.8rem',
      'top': '-0.7rem',
      'padding': '0 0.25rem',
    }, 80);
  });
  $('#password').focusout(function () {
    if ($(this).val() === '') {
      $('#password ~ label').animate({'fontSize': '1rem', 'top': '1rem', 'padding': 0}, 80);
    }
  });
  mdc.ripple.MDCRipple.attachTo(document.querySelector('#reauthenticateButton'));
}

dialog.listen('MDCDialog:accept', function () {
  $('#cancelButton').prop('disabled', false);
  resetReauthenticationDialog();
});
dialog.listen('MDCDialog:closing', function () {
  $('.mdc-list-item:nth-child(2) i.mdc-list-item__meta').html('lock');
  $('.mdc-list-item:nth-child(3) i.mdc-list-item__meta').html('lock');
});
$('.mdc-list-item:nth-child(2)').click(function () {
  resetReauthenticationDialog();
  $('.mdc-list-item:nth-child(2) i.mdc-list-item__meta').html('lock_open');
  dialog.open();
  $('#reauthenticateButton').click(function () {
    if ($('#password').val() != '') {
      var credential = firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, $('#password').val());
      $('#password').val('');
      firebase.auth().currentUser.reauthenticateAndRetrieveDataWithCredential(credential).then(function () {
        snackbar.show({message: 'Successfully Reauthenticated!', timeout: 4000});
        $('#reauthenticateBody').html(`Enter your new password below:<div class="outlined-input-field"style="margin-top: 1rem"><i class="material-icons">lock</i><input type="password"id="newPassword"class="outlined-text-field"autocomplete="off"readonly onfocus="if (this.hasAttribute('readonly')) {this.removeAttribute('readonly');this.blur();this.focus();}"><label for="newPassword"style="background-color: #FFFFFF">Password</label></div><br><button id="changePassword"class="mdc-button mdc-button--raised">Change Password</button>`);
        $('#newPassword').focusin(function () {
          $('#newPassword ~ label').animate({
            'fontSize': '0.8rem',
            'top': '-0.7rem',
            'padding': '0 0.25rem',
          }, 80);
        });
        $('#newPassword').focusout(function () {
          if ($(this).val() === '') {
            $('#newPassword ~ label').animate({
              'fontSize': '1rem',
              'top': '1rem',
              'padding': 0,
            }, 80);
          }
        });
        mdc.ripple.MDCRipple.attachTo(document.querySelector('#changePassword'));
        $('#changePassword').click(function () {
          firebase.auth().currentUser.updatePassword($('#newPassword').val()).then(function () {
            snackbar.show({message: 'Password changed successfully!', timeout: 4000});
            $('#cancelButton').prop('disabled', true);
            $('#doneButton').prop('disabled', false);
          }).catch(function (error) {
            snackbar.show({message: error, multiline: true, timeout: 10000});
          });
        });
      }).catch(function (error) {
        snackbar.show({message: error, multiline: true, timeout: 10000});
      });
    }
  });
});
$('.mdc-list-item:nth-child(3)').click(function () {
  resetReauthenticationDialog();
  $('.mdc-list-item:nth-child(3) i.mdc-list-item__meta').html('lock_open');
  dialog.open();
  $('#reauthenticateButton').click(function () {
    if ($('#password').val() != '') {
      var credential = firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, $('#password').val());
      $('#password').val('');
      firebase.auth().currentUser.reauthenticateAndRetrieveDataWithCredential(credential).then(function () {
        snackbar.show({message: 'Successfully Reauthenticated!', timeout: 4000});
        $('#reauthenticateBody').html('          Enter your updated email address below:          <div class="outlined-input-field" style="margin-top: 1rem">            <i class="material-icons">email</i>            <input type="email" id="email" class="outlined-text-field" autocomplete="off">            <label for="email" style="background-color: #FFFFFF">Email</label>          </div><br>          <button id="updateEmail" class="mdc-button mdc-button--raised">Update Email</button>        ');
        $('#email').focusin(function () {
          $('#email ~ label').animate({
            'fontSize': '0.8rem',
            'top': '-0.7rem',
            'padding': '0 0.25rem',
          }, 80);
        });
        $('#email').focusout(function () {
          if ($(this).val() === '') {
            $('#email ~ label').animate({'fontSize': '1rem', 'top': '1rem', 'padding': 0}, 80);
          }
        });
        mdc.ripple.MDCRipple.attachTo(document.querySelector('#updateEmail'));
        $('#updateEmail').click(function () {
          firebase.auth().currentUser.updateEmail($('#email').val()).then(function () {
            var user = firebase.auth().currentUser;
            $.ajax({
              type: 'POST',
              url: '/updateEmailAddress',
              data: {uid: user.uid, email: user.email},
              success: function (result) {
                console.log(result);
                if (result == 'updated email to ' + user.email + '.') {
                  snackbar.show({message: 'Email updated successfully!', timeout: 4000});
                  $('#cancelButton').prop('disabled', true);
                  $('#doneButton').prop('disabled', false);
                  user.sendEmailVerification().then(function () {
                    alert('Verification email has been sent.');
                    window.location.href = '/';
                  }).catch(function (error) {
                    console.log(error);
                    snackbar.show({message: error, multiline: true, timeout: 10000});
                  });
                }
              },
            });
          }).catch(function (error) {
            snackbar.show({message: error, multiline: true, timeout: 10000});
          });
        });
      }).catch(function (error) {
        snackbar.show({message: error, multiline: true, timeout: 10000});
      });
    }
  });
});
$('.mdc-list-item:nth-child(4)').click(function () {
  phoneDialog.open();
});
$('#phone').keyup(function () {
  $('#phone').parent().attr('class', 'outlined-input-field');
  $('#phone ~ .helper-text').empty();
});
$('#updateNumber').click(function () {
  if ($('#phone').val() === '') {
    $('#phone').parent().attr('class', 'outlined-input-field error-input-field');
    $('#phone ~ .helper-text').text('Please enter your new number!');
  } else if (/^\d+$/.test($('#phone').val()) === false) {
    $('#phone').parent().attr('class', 'outlined-input-field error-input-field');
    $('#phone ~ .helper-text').text('Please enter only numbers.');
  } else {
    $.ajax({
      type: 'POST',
      url: '/updatePhoneNumber',
      data: {uid: firebase.auth().currentUser.uid, phone: $('#phone').val()},
      success: function (result) {
        console.log(result);
        if (result == 'updated number to ' + $('#phone').val() + '.') {
          snackbar.show({message: 'Phone number updated successfully!', timeout: 4000});
          $('#phone').val('');
          phoneDialog.close();
        }
      },
    });
  }
});
$('.mdc-list-item:nth-child(5)').click(function () {
  locationDialog.open();
  if ($('#selectLocation').val() != null) {
    $('#selectLocation ~ label').animate({
      'fontSize': '0.8rem',
      'top': '-0.7rem',
      'padding': '0 0.25rem',
    }, 80);
  }
});
$('#updateLocation').click(function () {
  if ($('#selectLocation').val() === null) {
    snackbar.show({message: 'Please select your location!', timeout: 4000});
  } else {
    $.ajax({
      type: 'POST',
      url: '/updateLocation',
      data: {uid: firebase.auth().currentUser.uid, location: $('#selectLocation').val()},
      success: function (result) {
        console.log(result);
        if (result == 'updated location to ' + $('#selectLocation').val() + '.') {
          snackbar.show({message: 'Location updated successfully!', timeout: 4000});
          $('#selectLocation').val('');
          locationDialog.close();
        }
      },
    });
  }
});
$('.mdc-list-item:nth-child(6)').click(function () {
  bioDialog.open();
});
$('#updateBio').click(function () {
  if ($('#bio').val() === '') {
    snackbar.show({message: 'Please enter a bio!', timeout: 4000});
  } else {
    $.ajax({
      type: 'POST',
      url: '/updateBio',
      data: {uid: firebase.auth().currentUser.uid, bio: $('#bio').val()},
      success: function (result) {
        console.log(result);
        if (result == 'updated bio to ' + $('#bio').val() + '.') {
          snackbar.show({message: 'Bio updated successfully!', timeout: 4000});
          bioDialog.close();
        }
      },
    });
  }
});
