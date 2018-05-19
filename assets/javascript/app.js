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
  $('#userList').html(snap.numChildren());
  // The number of online users is the number of children in the connections list.
  //$("#watchers").append("hurry! " + snap.numChildren() + " are bidding");
  console.log(snap.numChildren());
});

//  At the page load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
database.ref().on(
  "value",
  function(snapshot) {
    console.log(snapshot.val());
  },
  function(errorObject) {
    //two different call back functions
    console.log("The read failed: " + errorObject.code);
  }
);
