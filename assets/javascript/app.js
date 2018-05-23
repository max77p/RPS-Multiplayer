
// Initialize Firebase
var config = {
  apiKey: "AIzaSyCoJ_guBP7y6kdrfZ6ajotd8oufsb5SGf4",
  authDomain: "rpsgame-bdaf8.firebaseapp.com",
  databaseURL: "https://rpsgame-bdaf8.firebaseio.com",
  projectId: "rpsgame-bdaf8",
  storageBucket: "rpsgame-bdaf8.appspot.com",
  messagingSenderId: "882257568229"
};
firebase.initializeApp(config);




var database = firebase.database();

var connectionsRef = database.ref("/connections");

var connectedRef = database.ref(".info/connected");

var chatLog = database.ref("/chatLog");

var userDB = database.ref("/UserDB");

var players = database.ref("/players");

var p1 = players.child("1");
var p2 = players.child("2");


connectedRef.on("value", function (snap) {
  // If they are connected..
  console.log(snap);

  if (snap.val()) {
    // Add user to the connections list.
    var con = connectionsRef;

    var con = connectionsRef.push(true);
    //addUser(con);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }

});

connectionsRef.on("value", function (snap) {
  // Display the viewer count in the html.
  $("#userList").html("current number of users: " + snap.numChildren());
  console.log(snap.val());

  // The number of online users is the number of children in the connections list.
  console.log(snap.numChildren());
});



firebase.auth().signInAnonymously().catch(function (error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});


function createUser() {
  
}

firebase.auth().onAuthStateChanged(function (user) {
  console.log(user);

  var name=prompt("what is your name?");
  var user = firebase.auth().currentUser;

  user.updateProfile({
    displayName: name
  }).then(function () {
    // Update successful.
  }).catch(function (error) {
    // An error happened.
  });

  var userId = user["uid"];
  

  if (user) {
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var dispName=user.displayName;
    allowUser(uid, isAnonymous,dispName);

    userDB.child(uid).onDisconnect().remove();

  } else {
    //disconnected
    allowUser.onDisconnect().remove();
  }

});



var prevUser;
var alreadyClicked;

$('.playClick1').on("click", function () {//button 1 click event
  var userplay = firebase.auth().currentUser;

  if (alreadyClicked) {
    alert("already clicked");
    return;
  }
  if (userplay) {
    var userclicked = userplay.displayName;//get unique id from user who clicked
    console.log(userclicked);
    p1.set({
      "losses": 0,
      "name": userclicked,
      "wins": 0
    })


  } else {
    // No user is signed in.
  }

});


var alreadyClicked2;
$('.playClick2').on("click", function () {//button 2 click event
  var userplay = firebase.auth().currentUser;
  if (alreadyClicked2) {
    alert("already clicked");
    return;
  }
  if (userplay) {
    var userclicked = userplay.displayName;//get unique id from user who clicked
    console.log(userclicked);
    p2.set({
      "losses": 0,
      "name": userclicked,
      "wins": 0
    })

  } else {
    // No user is signed in.
  }

});


p2.on("value", function (snapshot) {//player two to database
  var test = snapshot.val().name;
  console.log(test);
  if (test) {
    $('.playClick2').html(test);
    $('.playClick2').attr("data-name", test);
    alreadyClicked2 = true;
  }
});

p1.on("value", function (snapshot) {//player one to database
  var test = snapshot.val().name;
  console.log(test);
  if (test) {
    $('.playClick1').html(test);
    $('.playClick1').attr("data-name", test);
    alreadyClicked = true;
  }
});




//  At the page load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
database.ref(chatLog).orderByChild('chat').on("child_added", function (snapshot) {
  //gettings value to append to html
  // Log the value of the various properties
  console.log(snapshot.val());

  var chattext = snapshot.val().chat;
  var newLine = $("<br>");
  // Change the HTML
  $(".chatArea").append(newLine).append(chattext);
  $("#chatInput").val("");
},// If any errors are experienced, log them to console.
  function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);




function allowUser(uid, anon,name) {
  $("form").keypress(function (event) {
    // Grabbed values from text boxes
    if (event.which === 13) {
      event.preventDefault();
      inputtext(uid, anon,name);
    }
  });


}

function inputtext(uid, anon,name) {
  var text = $("#chatInput").val();
  var newUser = userDB.child(uid);
  var chatChild = chatLog.child(uid);


  newUser.set({
    'anon': anon,
    "name":name,
    "dateAdded": firebase.database.ServerValue.TIMESTAMP
  })

  // newUser.child("chat/").push(text);
  chatLog.push({
    "chat": text,
    "userid": uid
  })


}






