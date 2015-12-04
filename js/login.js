$(function() {

  Parse.$ = jQuery;

  // Replace this line with the one on your Quickstart Guide Page
  Parse.initialize("rriccses0xkmfyCu8JHUbRB3n4mJW1H3okqs1Sjh", "z8QtkGlujwURiXFdYzi4SV7L9X6BxWdQG6bVecA2");

  // login function
  $("#login").submit(function(event) {

    var currentUser = Parse.User.current();
    if (currentUser) {
      Parse.User.logOut();
    }

    event.preventDefault();

    var name = $("#login-name").val();
    var pass = $("#login-password").val();

    Parse.User.logIn(name, pass, {

      success: function(user){

        // saves date of last login
        var time = new Date();
        var timeMili = time.getFullYear()*10000 + (time.getMonth()+1)*100 + time.getDate();
        var last = user.get("loginTime");

        if(last == undefined) {
          last = timeMili;
        }
        user.set("lastLoginTime", last);
        user.set("loginTime", timeMili);

        console.log("Time " + timeMili);
        user.save(null, {
          lastLoginTime: last,
          loginTime: timeMili
        }, {
          success: function(user) {
            console.log("save login time successful");
            document.getElementById('save').value = 'Saved!';
          },
          error: function(user, error) {
            console.log("error when saving login time");
            document.getElementById('save').value = 'Error while saving.';
          }
        });


        console.log("cookie set");
        window.location = "welcome.html";
      },
      
      error: function(user, error){
        alert('Incorrect Username and/or Password');
      }

    });

  });

  // signup function
  $("#signup").submit(function(event) {
    // logout session before signing up
    var currentUser = Parse.User.current();
    if (currentUser) {
      Parse.User.logOut();
    }

    event.preventDefault();

    var email = $("#signup-email").val();
    var uname = $("#signup-name").val();
    var pass = $("#signup-password").val();

    // create new parse user and sets the username/password
    var user = new Parse.User();

    user.set("username", email);
    user.set("name", uname);
    user.set("password", pass);
    
    mixpanel.people.set({
        "$email": email,
        "$name": uname,
        "$created": Date(),
        "$last_login": new Date(),         // properties can be dates...
    });

    user.signUp(null, {

      success: function(user){
        alert('Welcome! Please login with your new account.');
        window.location = "login.html";
      },
      error: function(user, error){
        alert(error.message);
      }

    });

  });

});

function modalClose() {
    if (location.hash == '#openModal') {
        location.hash = '';
    }
}

document.addEventListener('keyup', function(e) {
    if (e.keyCode == 27) {
        modalClose();
    }
});

var modal = document.querySelector('#openModal');
modal.addEventListener('click', function(e) {
    modalClose();
}, false);

modal.children[0].addEventListener('click', function(e) {
    e.stopPropagation();
}, false);
