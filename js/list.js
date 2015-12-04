Parse.initialize("rriccses0xkmfyCu8JHUbRB3n4mJW1H3okqs1Sjh", "z8QtkGlujwURiXFdYzi4SV7L9X6BxWdQG6bVecA2");

var currentuser = Parse.User.current();
var username = currentuser.get("username");

var Habit = Parse.Object.extend("Habit");
var query = new Parse.Query(Habit);

query.equalTo("username", username);
query.find({
  success:function(results) {
    for(var i = 0; i < results.length; i++) {
      // retrieve habit info
      var object = results[i];
      var name = object.get('habitName');
      var dFreq = object.get('dailyFreq');
      var image = object.get('image');
      var count = object.get('thumbscount');
      var icon = object.get('iconImg');
      var imagesrc;

      if(image == "icon1") {
        imagesrc = "../img/sleep.jpg";
      } else if (image == "icon2") {
        imagesrc = "../img/salad.jpg";
      } else if (image == "icon3") {
        imagesrc = "../img/run.jpg";
      } else {
        imagesrc = icon.url();
      }

      // create elements
      $("#habit-list").append("<li>\
                      <ul class='habit-info'>\
                          <li><div class='habit-name'>"
                          + name + "</div></li>\
                          <li><img class='habit-icon' src='" + imagesrc +  "' alt='habit icon'></li>\
                      </ul>\
                      <div class='message'>\
                          <span class='message-total'>\
                              <strong>0</strong> days in a row! Best Record: <strong>0</strong><br>\
                                  <progress value=" + count + " max=" + dFreq + "></progress>\
                          </span><br>\
                          <span class='message-total'>Completed <strong>" + count + "/"+ dFreq + "</strong> for today!</span>\
                      </div>\
                      <div class='habit-op'>\
                          <button type='button' class='op op-done' onclick='showMsg(this);keepCount(/" + name + "/);' title='done'>\
                              <img src='../img/done.svg' alt='Done'>\
                          </button>\
                          <button type='button' class='op op-edit' onclick='lastHabit(/" + name + "/);' title='edit habit'>\
                              <img src='../img/edit.svg' alt='Edit'>\
                          </button>\
                          <button type='button' class='op op-del' onclick='deleteHabit(/" + name + "/);' title='delete habit'>\
                              <img src='../img/delete.svg' alt='Del'>\
                          </button>\
                      </div>\
                  </li>");
    }

  },
  error:function(error) {
    alert("Error when getting objects!");
  }
});

function lastHabit(name){
    currentuser.set("lastehabit", name);
    currentuser.save(null, {
      success: function(saved) {
        currentuser.set("lastehabit", name);
        window.location.assign("edit.html");
      },
      error: function(saved, error) {
      }
    });
}

function showMsg(element){
    var msgElement = (element.parentNode.parentNode.getElementsByClassName("message"))[0];
    // alert(msgElement.innerHTML);
    msgElement.style.visibility="visible";
}

function keepCount(name){
  query.equalTo("habitName", name);
  query.first({
    success: function(object) {
      console.log(object.get("thumbscount"));
      console.log(object.get("dailyFreq"));
      if(object.get("thumbscount") < object.get("dailyFreq")) {
        object.increment('thumbscount');
        object.save();
        console.log(object.get("thumbscount"));
        window.location.assign("list.html");
      }
    },
    error: function(error) {
      console.log("error");
    }

  });

}

function deleteHabit(name){
  query.equalTo("habitName", name);
  query.first({
    success: function(object) {
      object.destroy({});
      console.log("deleted");
      window.location.assign("list.html");
    },
    error: function(error) {
      console.log("error");
    }

  });
}
