Parse.initialize("rriccses0xkmfyCu8JHUbRB3n4mJW1H3okqs1Sjh", "z8QtkGlujwURiXFdYzi4SV7L9X6BxWdQG6bVecA2");

var currentuser = Parse.User.current();
currentuser.fetch();
var username = currentuser.get("username");

var habitCount = 0;


var Habit = Parse.Object.extend("Habit");
var query = new Parse.Query(Habit);
query.equalTo("username", username);
query.count({
   success: function(count) {
       habitCount = count;
       console.log("Habit Count: " + habitCount);
       dailyNotification(habitCount);
   },
    error: function(error) {
        console.log("Ooops");
    }

});

// Notifies the user on first login of the day that they have n number of habits to update
function dailyNotification(count) {

    //notify user only if first login of the day
    if (currentuser.get("loginTime") > currentuser.get("lastLoginTime") && checkNoticiationSettings()) {
        if (!("Notification" in window)) {
            alert("Update your " + count + " habits!");
        }
        else if (Notification.permission === "granted") {
            var notitificatoin = new Notification("Update your " + count + " habits!");
        }
        else if (Notification.permission !== "denied") {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    var notitificatoin = new Notification("Update your " + count + " habits!");
                }
            });
        }

        var loginTime = currentuser.get("loginTime");
        currentuser.set("lastLoginTime", loginTime);
        currentuser.save(null, {
            lastLoginTime: loginTime
        }, {
            success: function(currentuser) {
                console.log("save login time successful");
                document.getElementById('save').value = 'Saved!';
            },
            error: function(currentuser, error) {
                console.log("error when saving login time");
                document.getElementById('save').value = 'Error while saving.';
            }
        });


    }
}

function logoutButton() {
    Parse.User.logOut();
    window.location.href='login.html';
}

function goTo(page) {
    window.location.href=page;
}

// Check whether notifications are turned on
function checkNoticiationSettings() {
    var setting = currentuser.get("notificationSetting");
    return setting;
}

// Change notification settings
function changeNotificationSettings(value) {
    console.log("changeNotificationSettings()");

    currentuser.set("notificationSetting", value);
    currentuser.save(null, {
        notificationSetting: value
    }, {
        success: function(saved) {
            console.log("save notification successful");
            document.getElementById('save').value = 'Saved!';
        },
        error: function(saved, error) {
            console.log("error when saving notification");
            document.getElementById('save').value = 'Error while saving.';
        }
    });

}


function notificationSettingClicked() {
    console.log("Current user: " + currentuser.get("username"));

    var status = checkNoticiationSettings();

    /*var status = getCookie("notificationStatus");*/
    console.log("Before: " + status);


    if (status === "on") {
        var result = confirm("Do you want to turn OFF notifications?");
        if (result == true) {
            changeNotificationSettings("trashcan");
            //status = "off"
        }
    }
    else if (status === "trashcan" || status === "off"){
        var result = confirm("Do you want to turn ON notifications?");
        if (result == true) {
            changeNotificationSettings("on");
            //status = "on";
        }
    }

    console.log("After: " + checkNoticiationSettings());
}

$(function () {

    $("#username").append("<li>" + username + "<ul id='logout' onclick='logoutButton()'>\
     <li>Logout</li>\
     </ul></li>");

    element1 = document.getElementById("settings");
    if (element1){
        element1.addEventListener("click", notificationSettingClicked, false);
    }

});


