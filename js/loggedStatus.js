firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var email = user.email;
    var emailVerified = user.emailVerified;
    username = user.displayName;
    db.ref('users/' + user.uid).on('value', function(data) {
      profilePic = data.child('profilePic').val();
      if (emailVerified == false) {
        firebase.auth().signOut().then(function() {}).catch(function(error) {
          console.log(error);
        });
        $('#profileLinkInHeader').html('<a href="/signin" class="material-icons mdc-top-app-bar__action-item" aria-label="Sign In" alt="Sign In">account_circle</a>');
        $('#sideMenu .mdc-drawer__content .mdc-list:last-child').html(`
          <a href="/signin" class="mdc-list-item" tabindex="-1">Sign In</a>
          <a href="/signup" class="mdc-list-item" tabindex="-1">Sign Up</a>
        `);
        if (window.location.pathname == '/signin') {
          $('#sideMenu .mdc-drawer__content .mdc-list:last-child a:first-child').addClass('mdc-list-item--activated');
        } else if (window.location.pathname == '/signup') {
          $('#sideMenu .mdc-drawer__content .mdc-list:last-child a:last-child').addClass('mdc-list-item--activated');
        }
      } else {
        $('#profileLinkInHeader').html('<img src="' + profilePic + '" class="material-icons mdc-top-app-bar__action-item" onclick="window.location.href=\'/profile\'">');
        $('#sideMenu .mdc-drawer__content .mdc-list:last-child').html(`
          <a href="/profile" class="mdc-list-item" tabindex="-1">Profile</a>
          <a href="#" class="mdc-list-item" onclick="signOutUser()" tabindex="-1">Sign out</a>
        `);
        if (window.location.pathname == '/profile') {
          $('#sideMenu .mdc-drawer__content .mdc-list:last-child a:first-child').addClass('mdc-list-item--activated');
        }
      }
    });
  } else {
    // No user is signed in.
    $('#profileLinkInHeader').html('<a href="signin" class="material-icons mdc-top-app-bar__action-item" aria-label="Sign In" alt="Sign In">account_circle</a>');
    $('#sideMenu .mdc-drawer__content .mdc-list:last-child').html('\
      <a href="/signin" class="mdc-list-item" tabindex="-1">Sign In</a>\
      <a href="/signup" class="mdc-list-item" tabindex="-1">Sign Up</a>\
    ');
    if (window.location.pathname == '/signin') {
      $('#sideMenu .mdc-drawer__content .mdc-list:last-child a:first-child').addClass('mdc-list-item--activated');
    } else if (window.location.pathname == '/signup') {
      $('#sideMenu .mdc-drawer__content .mdc-list:last-child a:last-child').addClass('mdc-list-item--activated');
    }
  }
});
