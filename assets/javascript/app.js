
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

var p1 = players.child("1/");
var p2 = players.child("2/");

restartGame();
function restartGame() {
  connectedRef.on("value", function (snap) {
    // If they are connected..
    //console.log(snap);

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
}


firebase.auth().signInAnonymously().catch(function (error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});


firebase.auth().onAuthStateChanged(function (user) {
  console.log(user);

  if (user) {
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;

    allowUser(uid, isAnonymous);

    userDB.child(uid).onDisconnect().remove();

  } else {
    //disconnected
    allowUser.onDisconnect().remove();
  }
});


$("#nameInput").keypress(function (event) {
  // Grabbed values from text boxes
  if (event.which === 13) {
    event.preventDefault();
    getPlayer();
  }
});

$('.startBtn').on("click", function (e) {
  e.preventDefault();
  getPlayer();
})


function getPlayer() {
  var user = firebase.auth().currentUser;
  var getname = $('#nameInput').val();
  if (!getname) {
    alert("please enter a name");
  }
  else {
    user.updateProfile({
      displayName: getname
    }).then(function () {
      $('#nameInput').val('');
    }).catch(function (error) {
      // An error happened.
    });
  }
}



var alreadyClicked;
var u1ClkBtn;
var u2ClkBtn;
var prevUID;

$('.playClick1').on("click", function (e) {//button 1 click event
e.preventDefault();
var userplay = firebase.auth().currentUser;

  console.log(userplay);

  // if (alreadyClicked) {//if already clicked don't allow rest of action
  //   alert("already clicked");
  //   return;
  // }
  if (userplay && prevUID!=userplay.uid) {
    var userclicked = userplay.displayName;//get unique id from user who clicked
    console.log(userclicked);
    p1.set({
      "choice": "",
      "losses": 0,
      "name": userclicked,
      "wins": 0
    })
    prevUID=userplay.uid;
  } else {
    // No user is signed in.
  }
});



var alreadyClicked2;
$('.playClick2').on("click", function (e) {//button 2 click event
  
  e.preventDefault();
  var userplay = firebase.auth().currentUser;
  // if (alreadyClicked2) {
  //   alert("already clicked");
  //   return;
  // }

  if (userplay && prevUID!=userplay.uid) {
    var userclicked = userplay.displayName;//get unique id from user who clicked
    console.log(userclicked);
    p2.set({
      "choice": "",
      "losses": 0,
      "name": userclicked,
      "wins": 0
    })
    prevUID=userplay.uid;
  } else {
    // No user is signed in.
  }

});


$('.gameChoice1').hide();
$('.gameChoice2').hide();
p1.on("value", function (snapshot) {//player one from database
  var test = snapshot.val().name;
  console.log(test);
  if (test) {
    $('.playClick1').html(test);
    $('.playClick1').attr("data-name", test);


  }
});

p2.on("value", function (snapshot) {//player two from database
  var test = snapshot.val().name;
  console.log(test);
  if (test) {
    $('.playClick2').html(test);
    $('.playClick2').attr("data-name", test);


  }
});

var readyPlay;
players.on("value", function (snapshot) {
  var gameTime = snapshot.numChildren();
  if (gameTime == 2) {
    readyToPlay(snapshot);
  }
});

function readyToPlay(el) {//only show player 1 div, don't show player 2 div
  var user1 = el.val()[1];
  //console.log(user1.name);
  var user2 = el.val()[2];
  var user = firebase.auth().currentUser;
  //console.log(user);

  if (user.displayName == user1.name) {
    $('.gameChoice1').show();
  }
  else if (user.displayName == user2.name) {
    $('.gameChoice2').show();
  }

}



var oneSelected = false;
var twoSelected = false;
$('.gameChoice1').on("click", function (e) {
  e.preventDefault();
  console.log($(this));
  var user1Choice = $(this)[0].innerText.trim();
  console.log(user1Choice);
  oneSelected = true;
  bothPlayersSelected(user1Choice);
  oneSelected = false;
})

$('.gameChoice2').on("click", function (e) {
  e.preventDefault();
  console.log($(this));
  var user2Choice = $(this)[0].innerText.trim();
  console.log(user2Choice);
  twoSelected = true;
  bothPlayersSelected(user2Choice);
  twoSelected = false;
})

function bothPlayersSelected(el) {
  var user = firebase.auth().currentUser;

  if (oneSelected) {
    console.log(oneSelected);
    p1.update({
      "choice": el
    })
    $('.gameChoice1').hide();

  }
  if (twoSelected) {
    console.log(twoSelected);
    p2.update({
      "choice": el
    })
    $('.gameChoice2').hide();

  }

}

players.on("value", function (snapshot) {
  var p1 = snapshot.val()[1].choice;
  console.log(p1);
  var p2 = snapshot.val()[2].choice;
  console.log(p2);
  var choiceDiv1 = $('<div class=currentChoice>');
  var choiceDiv2 = $('<div class=currentChoice>');
  var message = $('.message');
  if (p1 && p2) {
    $('.gameChoice1,.gameChoice2').hide();
    var results = compare(p1, p2);

    if (results == p1) {
      message.text("player one wins!");
    }
    else if (results == p2) {
      message.text("player two wins!");
    }
    else {
      message.text("Its a tie!");
    }
    $('.playerOne').append(choiceDiv1.html(p1));
    $('.playerTwo').append(choiceDiv2.html(p2));

    setTimeout(function () {//after 5 seconds remove and reset
      readyToPlay(snapshot)
      $('.currentChoice').remove();
      message.text("");
      clearUpdate();
    }, 2000)



  }


});

function clearUpdate() {
  p1.update({
    "choice": ""
  })
  p2.update({
    "choice": ""
  })
}

var quitGame1;
$('.quitBtn').on("click", function (e) {
  e.preventDefault();
  quitGame1 = true;
  quitGame();

});

function quitGame() {
  players.on("child_added", function (snapshot) {
    console.log(snapshot.val());
    var u1 = snapshot.val().name;
    var u2 = snapshot.val().name;

    if (quitGame1) {
      players.remove();
      $('.gameChoice1').hide();
      $('.gameChoice2').hide();
      $('.playClick1').html("Press to Play");
      $('.playClick2').html("Press to Play");
      $('.playClick1').attr("data-name", "");
      $('.playClick2').attr("data-name", "");
      alreadyClicked = false;
      alreadyClicked2 = false;
      prevUID="";
      restartGame();
      quitGame1 = false;

    }




  });
}




// Run the compare function
// var results = compare(userChoice,computerChoice);
// Compare user choice vs computer choice
var compare = function (choice1, choice2) {
  if (choice1 === choice2) {
    return "It's a tie!";
  }
  if (choice1 === "Rock" && choice2 === "Scissors") {
    // rock wins
    return choice1;
  }
  else if (choice2 === "Rock" && choice1 === "Scissors") {
    return choice2;
  }

  if (choice1 === "Paper" && choice2 === "Rock") {
    // paper wins
    return choice1;
  }
  else if (choice2 === "Paper" && choice1 === "Rock") {
    return choice2;
  }

  if (choice1 === "Scissors" && choice2 === "Paper") {
    //scissors wins
    return choice1;
  }
  else if (choice2 === "Scissors" && choice2 === "Paper") {
    return choice2;
  }

};







//  At the page load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
database.ref(chatLog).orderByChild('chat').on("child_added", function (snapshot) {
  //gettings value to append to html
  // Log the value of the various properties
  //console.log(snapshot.val());

  var chattext = snapshot.val().chat;
  var chatname = snapshot.val().name;
  var newLine = $("<br>");
  // Change the HTML
  $(".chatArea").append(newLine).append(chatname + " : " + chattext);
  $("#chatInput").val("");
},// If any errors are experienced, log them to console.
  function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);




function allowUser(uid, anon) {
  $(".chatForm").keypress(function (event) {
    // Grabbed values from text boxes
    if (event.which === 13) {
      event.preventDefault();
      inputtext(uid, anon);
    }
  });


}

function inputtext(uid, anon) {//input chat text to database
  var text = $("#chatInput").val();
  var newUser = userDB.child(uid);
  var chatChild = chatLog.child(uid);
  var user = firebase.auth().currentUser;
  console.log(user);

  newUser.set({
    'anon': anon,
    "name": user.displayName,
    "dateAdded": firebase.database.ServerValue.TIMESTAMP
  })


  chatLog.push({
    "chat": text,
    "name": user.displayName,
    "userid": uid
  })

}











