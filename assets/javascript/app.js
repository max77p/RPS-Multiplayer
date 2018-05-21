
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

//TODO: create rock paper scissors game
//TODO: set database
//TODO: get value from database


var database = firebase.database();

var connectionsRef = database.ref("/connections");

var connectedRef = database.ref(".info/connected");

var chatLog = database.ref("/chatLog");

var userDB = database.ref("/UserDB");


connectedRef.on("value", function (snap) {
  // If they are connected..
  console.log(snap);

  if (snap.val()) {
    // Add user to the connections list.
    var con = connectionsRef;

    var con = connectionsRef.push(true);
    addUser(con);
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

      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      allowUser(uid, isAnonymous);
      //console.log(userstext);
      // newUser.set({
      //   'anon': isAnonymous,
      //   "dateAdded": firebase.database.ServerValue.TIMESTAMP
      // })
      userDB.child(uid).onDisconnect().remove();

    } else {
      //disconnected
      allowUser.onDisconnect().remove();
    }

  });

};


//  At the page load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
database.ref(chatLog).orderByChild('chat').on("child_added", function (snapshot) {
  //gettings value to append to html
  // Log the value of the various properties
  console.log(snapshot.val());



  var chattext = snapshot.val().chat;



  var userTd = $('<td id="name-display">').text(chattext);

  //TODO::Same thing for each td
  var tRow = $("<tr>");
  tRow.append(userTd);
  //TODO::Add each other td

  // Change the HTML
  $(".tbody").first().append(tRow);

},// If any errors are experienced, log them to console.
  function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);




function allowUser(uid, anon) {
  $("form").keypress(function (event) {
    // Grabbed values from text boxes
    if (event.which === 13) {
      event.preventDefault();
      inputtext(uid, anon);
    }
  });


}

function inputtext(uid, anon) {
  var text = $("#chatInput").val();
  var newUser = userDB.child(uid);
  var chatChild = chatLog.child(uid);


  newUser.set({
    'anon': anon,
    "dateAdded": firebase.database.ServerValue.TIMESTAMP
  })

  // newUser.child("chat/").push(text);
  chatLog.push({
    "chat": text
  })



}







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
