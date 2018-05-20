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
$("#btnLogout").hide();
$(".chatArea").hide();

var database = firebase.database();

var connectionsRef = database.ref("/connections");

var connectedRef = database.ref(".info/connected");
//var childUserInfo=loggedUserInfo.child('/name')

// var auth = firebase.auth();
// auth.signInAnonymously();//will return a promise
// auth.signOut();
// auth.onAuthStateChange(user);

//click login event listener
$("#btnLogin").on("click", function(el) {
  el.preventDefault();
  el.stopPropagation();

  firebase
    .auth()
    .signInAnonymously()
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  var startChat;

  firebase.auth().onAuthStateChanged(function(user) {
    console.log(user);
    var userId = user["uid"];

    if (user) {
     var askname = prompt("what is your name?");
      $("#btnLogin").hide();
      $("#btnLogout").show();
      $(".chatArea").show();
      startChat = true;
      writeUserData(userId, askname);
  
    } else {
      $("#btnLogout").hide();
      $("#btnLogin").show();
      $(".chatArea").hide();
    }
    //   var isAnonymous = user.isAnonymous;
    //   var uid = user.uid;
    //   // ...
    // } else {
    //   // User is signed out.
    //   // ...
    // }
    // ...
  });
});

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

function writeUserData(userId, askname) {
  firebase
    .database()
    .ref("users/" + askname)
    .set({
      userid: userId,
      text:""
    });
}

function updatedata(chattext) {
  database.ref("users/"+chattext).set({
    text:chattext
  });
}

//click logout event listener
$("#btnLogout").on("click", function(el) {
  el.preventDefault();
  el.stopPropagation();

  startChat = false;
  firebase.auth().signOut();
  $("#btnLogin").show();
  $("#btnLogout").hide();
  $(".chatArea").hide();
});

var testUser = {};

//  At the page load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
database.ref().on("value",function(childSnapshot) {
    //gettings value to append to html
    // Log the value of the various properties
    var userText1 = childSnapshot.val().chatlog;
    userText=userText1['chat'];
   
    var userTd = $('<td id="name-display">').text(userText);

    //TODO::Same thing for each td
    var tRow = $("<tr>");
    tRow.append(userTd);
    //TODO::Add each other td

    // Change the HTML
    $(".tbody")
      .first()
      .append(tRow);

    // If any errors are experienced, log them to console.
  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);




$("#enterChatText").on("click", function(event) {

  // Grabbed values from text boxes
    var text = $("#chatInput")
    .val()
    .trim();
    
    firebase.database().ref("chatlog/").set({
      chat: text,
    });
});



