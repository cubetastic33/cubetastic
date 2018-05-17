firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var nowUser = firebase.auth().currentUser;
    var email = nowUser.email;
    var emailVerified = nowUser.emailVerified;
    var username;
    var profilePic;
    var usersRef = db.ref('users').orderByChild('email').equalTo(email);
    usersRef.once('child_added', function(snapshot) {
      username = snapshot.val().username;
      profilePic = snapshot.val().profilePic;

      if (emailVerified == false) {
        $('#loggedStatus').html("<a href=\"signin.html\" class=\"logout\">Email Not Verified | Sign in</a>");
        firebase.auth().signOut().then(function() {}).catch(function(error) {});
      } else {
        $('#loggedStatus').html('\
          <img src="'+profilePic+'" id="profilePic" class="circle right" alt="profile pic">\
          <div id="usernameInHeader" class="hide-on-small-only">'+username+'</div>\
          <ul class="logout">\
            <li><a href="profile.html">Profile</a></li><br>\
            <li><a href="#" onclick="signOutUser()">Sign out</a></li>\
          </ul>\
        ');
        $('#loggedStatus').hover(function() {
          $('#loggedStatus ul').toggle();
        });
      }
    }, function (errorObject) {
      console.log('The read failed: ' + errorObject.code);
    });
  } else {
    // No user is signed in.
    if (document.getElementById("loggedStatus").innerHTML == "") {
      $('#loggedStatus').html('<a id="signInButton" href="signin.html">Sign in</a>');
    }
  }
});
