// Initialize Firebase

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAi8BmcQ15o7e9fptcEZYjwx-knllryTnc",
    authDomain: "rpsgame-98ea6.firebaseapp.com",
    databaseURL: "https://rpsgame-98ea6.firebaseio.com",
    projectId: "rpsgame-98ea6",
    storageBucket: "rpsgame-98ea6.appspot.com",
    messagingSenderId: "505248843531"
  };
  firebase.initializeApp(config);


//TODO: create rock paper scissors game
//TODO: set database
//TODO: get value from database

var database = firebase.database();

var connectionsRef = database.ref("/connections");

var connectedRef = database.ref(".info/connected");

connectedRef.on("value", function(snap) {
  // If they are connected..
  console.log(snap.val());
  if (snap.val()) {
    // Add user to the connections list.
    var con = connectionsRef.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

connectionsRef.on("value", function(snap) {
  // Display the viewer count in the html.
  $("#userList").html("current number of users: " + snap.numChildren());
  // The number of online users is the number of children in the connections list.
  console.log(snap.numChildren());
});

//  At the page load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
database.ref().on("child_added", function (childSnapshot, prevChildKey) {//gettings value to append to html

    // Print the initial data to the console.
    console.log(childSnapshot.val());

    // Log the value of the various properties
    var userText = childSnapshot.val().text;
    

    var userTd = $('<td id="name-display">').text(userText);
  
    
    //TODO::Same thing for each td
    var tRow=$('<tr>');
    tRow.append(userTd);
    //TODO::Add each other td

    // Change the HTML
    $('.tbody').first().append(tRow);
    

    // If any errors are experienced, log them to console.
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

$("#enterChatText").on("click", function(event) {
  event.preventDefault();

  // Grabbed values from text boxes
  text = $("#chatInput").val().trim();
  $("#chatInput").val("");
  // Code for handling the push
  database.ref().push({
    text: text,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});

// var auth = firebase.auth();
// auth.signInAnonymously();//will return a promise
// auth.signOut();
// auth.onAuthStateChange(user);


//var btnLogin=document.getElementById('btnLogin');
var btnLogout=document.getElementById('btnLogout');

$('#btnLogin').on("click",function(el){
  el.preventDefault();
  firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
});