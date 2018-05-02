firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var uid = firebase.auth().currentUser.uid;
    var existingProfilePic = db.ref("users/"+uid).child("profilePic");
    existingProfilePic.on("value", function(data) {
      data.val();
      $("#profilePicAtProfile").attr("src", data.val());
      $("#profilePicAtProfile").click(function() {$("#newProfilePic").click();});
      $("#newProfilePic").on("change", function(e) {
        console.log("Chose new file");
        var newProfilePic = e.target.files[0];
        storage.ref("profile-pics/"+uid+"/"+newProfilePic.name).put(newProfilePic).then(function() {
          var imageRef = storage.ref("profile-pics/"+uid+"/"+newProfilePic.name);
          imageRef.getDownloadURL().then(function(url) {
            existingProfilePic.set(url);
            window.location.href="/profile.html";
          });
        });
      });
    });
    var userRef = db.ref("users/"+uid);
    var username;
    var email;
    var location;
    userRef.on("value", function(data) {
      username = data.val().username;
      email = data.val().email;
      location = data.val().location;
      $('#profileUsername').append(username);
      $('#profileEmail').append(user.email);
      $('#emailId').append(email);
      $('#locationSelector').val(location);

      $('#deleteAccount').click(function() {
        $('#profileMsg').show();
        $('#profileMsg').html('Please type your password to continue: <br>\
        <form id="reauthenticate">\
          <input type="password" id="passwordInput" placeholder="password" required>\
          <button type="submit">Delete</button>\
        </form>');
        $('#reauthenticate').submit(function(e) {
          e.preventDefault();
          var credential = firebase.auth.EmailAuthProvider.credential(
            user.email, 
            $('#passwordInput').val()
          );
          firebase.auth().currentUser.reauthenticateWithCredential(credential).then(function() {
            var confirmText = 'Delete '+username+' from comet';
            var confirm = prompt('Are you sure? This will delete all your data, except for the posts you have written! Type "'+confirmText+'" below to continue');
            if (confirm == confirmText) {
              db.ref('chat').on('value', function(snapshot) {
                snapshot.forEach(function(data) {
                  db.ref('chat/'+data.key+'/'+uid).remove();
                  //data.child(uid).remove();
                });
                db.ref('inbox').child(uid).remove();
                db.ref('users').child(uid).remove();
                /*firebase.auth().currentUser.delete().catch(function(err) {
                  $('#profileMsg').show();
                  alert('\
                  Your account was NOT deleted succesfully. Some of your data still remains, \
                  but you will not be able to login to your account anymore, and nobody can \
                  see any of your chat messages. Please try again immediately, otherwise you may \
                  not be able to create another comet account with your email id!');
                  console.log('\
                  Your account was NOT deleted succesfully. Some of your data still remains, \
                  but you will not be able to login to your account anymore, and nobody can \
                  see any of your chat messages. Please try again immediately, otherwise you may \
                  not be able to create another comet account with your email id!');
                  $('#profileMsg').html('\
                  Your account was NOT deleted succesfully. Some of your data still remains, \
                  but you will not be able to login to your account anymore, and nobody can \
                  see any of your chat messages. Please try again immediately, otherwise you may \
                  not be able to create another comet account with your email id!');
                });*/
              });
            }
          }).catch(function(err) {
            console.log(err);
          });
        });
      });
    });
  }
});
