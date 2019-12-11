// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
    console.log("Device is ready!");
    navigator.geolocation.getCurrentPosition(geoCallBack, onError);
    document.getElementById("userInfo").hidden = true;
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})

var userLocation;
function geoCallBack(position) {
    userLocation = {
        lat: position.coords.latitude,
        long: position.coords.longitude
    }
    console.log("userLocation:" + userLocation.lat + " " + userLocation.long);

}

function onError(message) {
    console.log(message);
}

var user;
function Login() {
    var url = "http://127.0.0.1:8081/Login";
    var http = new XMLHttpRequest();
    // Preparing the request
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'application/json');
    // Sending the request
    http.send(JSON.stringify({ email: document.getElementById("loginEmail").value, userpassword: document.getElementById("loginPassword").value }));

    // Called when we get a response
    http.onreadystatechange = (e) => {
        // Getting the response in a text format
        var response = http.response;
        // converting the response from a text format to a json format
        console.log(response);
        try {
            var responseJSON = JSON.parse(response);
            user = responseJSON[0];
            document.getElementById("userName").innerHTML = responseJSON[0].name;
            document.getElementById("age").innerHTML = responseJSON[0].age;
            document.getElementById("smoker").innerHTML = responseJSON[0].smoker;
            document.getElementById("longitude").innerHTML = responseJSON[0].longitude;
            document.getElementById("latitude").innerHTML = responseJSON[0].latitude;

            FindRoommates(1000, user.latitude, user.longitude);

            document.getElementById("registerSection").hidden = true;
            document.getElementById("Login").hidden = true;
            document.getElementById("userInfo").hidden = false;

            //LoggedIn();

        }
        catch (err) {

        }

    }
}
function Register() {
    RegisterValues.email = document.getElementById("regEmail").value;
    RegisterValues.name = document.getElementById("regName").value;
    RegisterValues.smoker = "true";
    //TODO Get Values from navigator

    RegisterValues.latitude = userLocation.lat;
    RegisterValues.longitude = userLocation.long;
    RegisterValues.password = document.getElementById("regPassword").value;
    RegisterValues.age = document.getElementById("regAge").value;
    console.log(RegisterValues);
    var url = "http://127.0.0.1:8081/registration";
    var http = new XMLHttpRequest();
    // Preparing the request
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'application/json');
    // Sending the request
    http.send(JSON.stringify(RegisterValues));
    // Called when we get a response
    http.onreadystatechange = (e) => {
        // Getting the response in a text format
        var response = http.response;
        // converting the response from a text format to a json format
        var responseJSON = JSON.parse(response);

        try {
            var responseJSON = JSON.parse(response);

            document.getElementById("message").innerHTML = "Successfully registered";


        }
        catch (err) {

        }

    }
}

function FindRoommates(range, currentlatitude, currentlongitude) {
    var url = "http://localhost:8081/roommates" + "?distance=" + range + "&latitude=" + currentlatitude + "&longitude=" + currentlongitude;
    var http = new XMLHttpRequest();
    var response
    // Preparing the request
    http.open("GET", url, true);
    http.setRequestHeader('Content-Type', 'application/json');

    // Sending the request

    http.send();


    // Called when we get a response
    http.onreadystatechange = (e) => {
        // Getting the response in a text format
        response = http.response;
        // converting the response from a text format to a json format
        var responseJSON = JSON.parse(response);
        console.log(response);
        try {
            var responseJSON = JSON.parse(response);
            addRoomatesToHtml(responseJSON);
        }
        catch (err) {
            console.log("Error:" + err.message)
        }

    }


}

function addRoomatesToHtml(Roommates) {


    var html = "";

    for (var i = 0; i < Roommates.length; i++) {
        console.log(Roommates[i].age + " " + Roommates[i].smoker);
        html = "";
        if (Roommates[i].smoker == user.smoker && (Roommates[i].age + 10) >= user.age && (Roommates[i].age - 10) <= user.age) {
            html += '<div class="colourband Roommate">'
                + '<p class="RoommateName">' + Roommates[i].name + '</p>'
                + '<p class="RoommateAge">' + Roommates[i].age + '</p>'
                + '<p class="RoommateLatitude">' + Roommates[i].latitude + '</p>'
                + '<p class="RoommateLongitude">' + Roommates[i].longitude + '</p>'
                + '</div>';
        }
    }

    document.getElementById("roommates").innerHTML = html;


}


var RegisterValues = {
    "email": "",
    "name": "",
    "age": 0,
    "smoker": "",
    "latitude": 0.0,
    "longitude": 0.0,
    "password": ""
}
