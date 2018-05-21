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

var chatLog = database.ref("chatLog");




connectedRef.on("value", function (snap) {
  // If they are connected..
  console.log(snap);

  if (snap.val()) {
    // Add user to the connections list.
    var con = connectionsRef;
    //var con = connectionsRef.push(true);
    addUser(con);
    // Remove user from the connection list when they disconnect.
    //con.onDisconnect().remove();
  }

});

connectionsRef.on("value", function (snap) {
  // Display the viewer count in the html.
  $("#userList").html("current number of users: " + snap.numChildren());
  console.log(snap.val());

  // The number of online users is the number of children in the connections list.
  console.log(snap.numChildren());
});

function addUser(el) {

  firebase.auth().signInAnonymously().catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });

  firebase.auth().onAuthStateChanged(function (user) {
    console.log(user);
    var userId = user["uid"];
    console.log(userId);


    

    if (user) {

    var userDB = database.ref("UserDB");
    var newUser = userDB.child(userId);

      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      newUser.set({
        'anon': isAnonymous
      })

      newUser.onDisconnect().remove();
    } else {
      alert("has disconnected");
    }

  });

};



//  At the page load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
chatLog.on("child_added", function (snapshot) {
  //gettings value to append to html
  // Log the value of the various properties

  snapshot.forEach(function (textSnap) {
    console.log(textSnap.val());

    var userText = textSnap.val();
    console.log(userText);
    //userText = userText1["chat"];

    var userTd = $('<td id="name-display">').text(userText);

    //TODO::Same thing for each td
    var tRow = $("<tr>");
    tRow.append(userTd);
    //TODO::Add each other td

    // Change the HTML
    $(".tbody").first().append(tRow);
  });

},// If any errors are experienced, log them to console.
  function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);



$("#enterChatText").on("click", function (event) {
  // Grabbed values from text boxes
  var text = $("#chatInput").val().trim();

  chatLog.push({
    chat: text
  });
});






//click logout event listener
// $("#btnLogout").on("click", function (el) {
//   el.preventDefault();
//   //el.stopPropagation();


//   startChat = false;
//   firebase.auth().signOut();
//   $("#btnLogin").show();
//   $("#btnLogout").hide();
//   $(".chatArea").hide();

// });
//click login event listener
// $("#btnLogin").on("click", function (el) {
//   el.preventDefault();
//   el.stopPropagation();

//   firebase.auth().signInAnonymously().catch(function (error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // ...
//   });
// });
// var userIdArr = [];
// firebase.auth().onAuthStateChanged(function (user) {
//   console.log(user);
//   var userId = user["uid"];
//   if (user) {
//     var isAnonymous = user.isAnonymous;
//     var uid = user.uid;
//     userIdArr.push(uid);
//     console.log(isAnonymous);
//     console.log(uid);


//     //var askname = prompt("what is your name?");
//     $("#btnLogin").hide();
//     $("#btnLogout").show();
//     $(".chatArea").show();
//     startChat = true;
//     writeUserData(userId, isAnonymous);
//   } else {
//     user.onDisconnect().remove();
//     $("#btnLogout").hide();
//     $("#btnLogin").show();
//     $(".chatArea").hide();

//   }

//   //console.log(userIdArr);


//   //console.log(user);
// });
