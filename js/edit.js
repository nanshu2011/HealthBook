
  Parse.initialize("rriccses0xkmfyCu8JHUbRB3n4mJW1H3okqs1Sjh", "z8QtkGlujwURiXFdYzi4SV7L9X6BxWdQG6bVecA2");

  var currentuser;
  var username;
  var habit;
  function init(){
    currentuser = Parse.User.current();
    username = currentuser.get("username");
    //fetch habit from database
    var Habit = Parse.Object.extend("Habit");
    var habitname;
    currentuser.fetch({
      success: function(currentuser){
        habitname = currentuser.get("lastehabit");
        var habitquery = new Parse.Query(Habit);
        habitquery.equalTo("habitName", habitname);
        habitquery.equalTo("username", username);
        habitquery.find({
          success: function(results) {
            // Do something with the returned Parse.Object values
            var object = results[0];
            object.fetch({
              success: function(object){
                selectImage(object.get("image"));
                document.getElementById("title").value = object.get("habitName");
                document.getElementById("others").value = object.get("dailyFreq");
                var weekFreq = object.get("weekFreq");
                var week = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
                for(var i = 0; i < week.length; i++){
                  document.getElementById(week[i]).checked = false;
                }
                for(var i = 0; i < weekFreq.length; i++){
                  document.getElementById(weekFreq[i]).checked = true;
                }
                habit = object;
              }
            });
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
      }
    });
  }
  window.onload = init();
  //function handleInput
  var imageName/* = document.getElementById(name)*/;
  function selectImage(name) {
    //Clear all the other effects
    // Test to push
    document.getElementById('icon1').style.border = "none";
    document.getElementById('icon2').style.border = "none";
    document.getElementById('icon3').style.border = "none";
    var image = document.getElementById(name);
    image.style.border = "5px solid #42A5F5";
    imageName = name;
  }
  function saveHabit(){
    var Habit = Parse.Object.extend("Habit");
    var daysofweek = [];
    var habitTitle = document.getElementById("title").value;
    // check for title
    if (!habitTitle){
      document.getElementById("habittitleError").innerHTML = '* Habit Title cannot be empty!';
      return;
    }
    else{
      // check if title already exists
      habitTitle = document.getElementById("title").value;
      //document.getElementById("habittitleError").innerHTML = habitTitle;
      var habitQuery = new Parse.Query(Habit);
      habitQuery.equalTo("habitName", habitTitle);
      document.getElementById("habittitleError").value='false';
      if (document.getElementById("habittitleError").value=='true'){
        return;
      }
      document.getElementById("habittitleError").innerHTML = '';
    }
    if (!imageName){
      document.getElementById("habiticonError").innerHTML = '* Habit Icon cannot be empty!';
      return;
    }
    else{
      document.getElementById("habiticonError").innerHTML = '';
    }
    $("input:checkbox[name=date]:checked").each(function(){
      daysofweek.push($(this).val());
    });
    if(daysofweek.length==0){
      //daysofweek = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
      document.getElementById("weekfreError").innerHTML = '* Weekly Frequency cannot be empty!';
      return;
    }
    else{
      document.getElementById("weekfreError").innerHTML = '';
    }
    var timesPerDay = $('input[name="day"]:checked').val();
    var timesPerDayInt;
    if(typeof timesPerDay === 'undefined'){
      timesPerDay = document.getElementById('others').value;
    };
    switch(timesPerDay){
      case "one":
        timesPerDayInt = 1;
        break;
      case "two":
        timesPerDayInt = 2;
        break;
      case "three":
        timesPerDayInt = 3;
        break;
      default:
        timesPerDayInt = parseInt(timesPerDay);
        if(Number.isNaN(timesPerDayInt)){
          document.getElementById('otherError').innerHTML = '* Daily Frequency is empty or not a valid integer!';
          return;
        }
        else
        {
          document.getElementById('otherError').innerHTML = '';
        }
        break;
    }
    habit.set("image",imageName);
    habit.set("habitName",habitTitle);
    habit.set("weekFreq",daysofweek);
    habit.set("dailyFreq",timesPerDayInt);
    habit.save(null, {
      image: imageName,
      habitName: habitTitle,
      weekFreq: daysofweek,
      dailyFreq: timesPerDayInt
    }, {
      success: function(habit) {
        // The object was saved successfully.
        console.log('successfully saved habit');
        document.getElementById('save').value = 'Saved!';
        window.location.assign("list.html");
      },
      error: function(habit, error) {
        // The save failed.
        // error is a Parse.Error with an error code and message.
        console.log('failed to save habit');
        document.getElementById('save').value = 'Error while saving.';
      }
    });
    window.location.assign("list.html");
  }
