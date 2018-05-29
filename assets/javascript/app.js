
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

var currentUser = database.ref("userClick");

var userDB = database.ref("/UserDB");

var players = database.ref("/players");

var p1 = players.child("one");
var p2 = players.child("two");

var passUserName = database.ref("twoUsers");



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
  $("#userList").html("Users online: " + snap.numChildren());
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

$('.startBtn').on("click", function (e) {//submit name button
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

var u1ClkBtn;
var u2ClkBtn;
var currUID;
var prevUID;

$('.quitBtn').hide();
$('.playClick1,.playClick2').on("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  var userplay = firebase.auth().currentUser;
  console.log(userplay.uid);
  if (userplay.uid === prevUID) {
    alert("try again");
  }
  else {
    if (donotallow) {
      return;
    }
    else {
      currentUser.set({
        "userid": userplay.uid,
        "btn": e.target.classList[3],
        "user": userplay.displayName
      })

    }
  }
});



var donotallow;//if user clicked, don't let them click another button
currentUser.child('userid').on("value", function (snapshot) {
  console.log(snapshot.val());
  currUID = snapshot.val();
  console.log(currUID);
  console.log(prevUID);
  if (currUID === prevUID) {
    donotallow = true;//after prevuid is set, don't allow this user to click another button
  }
  else {
    console.log("no previous id click event, you are good to go");
    prevUID = currUID;
    donotallow = false;
  }

});

//TODO-check which button clicked and then bind the username and hide the button
currentUser.on("value", function (snapshot) {
  console.log(snapshot.val().btn);//playclick1
  var clicked = snapshot.val().btn;
  var username = snapshot.val().user;
  var userid = snapshot.val().userid;

  var clickedClass1 = $('.playClick1');
  var clickedClass2 = $('.playClick2');
  //console.log(clickedclass1.hasClass(snapshot.val()));//works

  if (clickedClass1.hasClass(clicked)) {
    console.log("btn 1 binded!");
    addP1Screen(username, userid, clickedClass1);
  }
  else if (clickedClass2.hasClass(clicked)) {
    console.log("btn 2 binded!");
    addP2Screen(username, userid, clickedClass2);
  }

});

$('.gameChoice1').hide();
$('.gameChoice2').hide();

//TODO: add names to screen and remove buttons
function addP1Screen(elName, elId, elBtn) {
  // var h2 = $('<h2 class="userName">');
  // $('.playClick1').hide();
  // h2.html(elName);
  // $('.playerOne').prepend(h2);
  //$('.playClick1').attr("data-name", elName);
  var user = firebase.auth().currentUser;
  if(user.displayName===elName){
    $('.quitBtn').show();
  }
  
  p1.set({
    "losses": 0,
    "name": elName,
    "wins": 0
  })
  passUserName.update({
    "u1": elName,
    "btn1": true
  })
}

function addP2Screen(elName, elId, elBtn) {
  var user = firebase.auth().currentUser;
  if(user.displayName===elName){
    $('.quitBtn').show();
  }
  //$('.playClick1').attr("data-name", elName);
  p2.set({
    "losses": 0,
    "name": elName,
    "wins": 0
  })
  passUserName.update({
    "u2": elName,
    "btn2": true
  })
}


passUserName.on("value", function (snapshot) {//keep username on page even if refreshed
  console.log(snapshot.val());
  $('#nameOne').html(snapshot.val().u1);
  if (snapshot.val().btn1) {
    $('.playClick1').hide();
  }

  $('#nameTwo').html(snapshot.val().u2);
  if (snapshot.val().btn2) {
    $('.playClick2').hide();
  }

});



var readyPlay;
var gameTimer;
var counter;
players.on("value", function (snapshot) {//start the game if both players clicked
  var gameTime = snapshot.numChildren();
  // $('.playClick1').hide();
  // $('.playClick2').hide();
  console.log(snapshot.val());
  console.log(gameTime);
  console.log(snapshot.val());
  if (gameTime == 2) {
    readyPlay = true;
    readyToPlay(snapshot);
  }
});
// var n=5;

// function timer(){
//   n--;
//   console.log(n);
//   if(n < 0){
//      resetEntireGame();
//      //clearInterval(counter);
//   }
//   console.log(n);
// }

// console.log(gameTimer);

function readyToPlay(elSnap) {//only show player 1 div, don't show player 2 div
  var user1 = elSnap.val()['one'];//first player
  //console.log(user1.name);
  var user2 = elSnap.val()['two'];//second player
  var user = firebase.auth().currentUser;
  //console.log(user);

  if (user.displayName == user1.name) {
    $('.gameChoice1').show();//show the respective game choice screen
    $('.quitBtn').show();
  }
  if (user.displayName == user2.name) {
    $('.gameChoice2').show();//show the respective game choice screen
    $('.quitBtn').show();
  }

}



var oneSelected = false;
var twoSelected = false;
$('.gameChoice1').on("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  //console.log($(this));
  var user1Choice = $(this)[0].innerText.trim();
  console.log(user1Choice);
  oneSelected = true;
  bothPlayersSelected(user1Choice);
  oneSelected = false;
})

$('.gameChoice2').on("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  console.log($(this));
  var user2Choice = $(this)[0].innerText.trim();
  console.log(user2Choice);
  twoSelected = true;
  bothPlayersSelected(user2Choice);
  twoSelected = false;
})

function bothPlayersSelected(el) {
  var user = firebase.auth().currentUser;
  //var h4One = $('<h4 class="showChoice">');
  //var h4Two = $('<h4 class="showChoice">');
  if (oneSelected || twoSelected) {
    if (oneSelected) {
      console.log(oneSelected);
      $('#p1Selection').html(el);
      p1.update({
        "choice": el
      })
      $('.gameChoice1').hide();
      //TODO:show which was selected-done

      //$('.playerOne').append(h4One);
    }
    else if (twoSelected) {
      console.log(twoSelected);
      $('#p2Selection').html(el);
      p2.update({
        "choice": el
      })
      $('.gameChoice2').hide();
      //TODO:show which was selected-done

      //$('.playerTwo').append(h4Two);
    }
  }
}
//player 1 win or lost counter
var p1Win = 0;
var p1Lost = 0;

//player 1 win or lost counter
var p2Win = 0;
var p2Lost = 0;
players.on("value", function (snapshot) {
  console.log(snapshot.val());
  var p1Choice = snapshot.val().one['choice'];
  //console.log(p1);
  var p2Choice = snapshot.val().two['choice'];
  //console.log(p2);
  var choiceDiv1 = $('<div class=currentChoice>');
  var choiceDiv2 = $('<div class=currentChoice>');
  var message = $('.message');


  if (p1Choice && p2Choice) {//game logic
    $('#p1Selection').empty();
    $('#p2Selection').empty();
    $('.gameChoice1,.gameChoice2').hide();
    // $('.game1,.game2').hide();

    var results = compare(p1Choice, p2Choice);

    if (results === p1Choice) {
      message.text("Player one wins!");
      p1Win += 1;//increase score by 1 for p1
      p2Lost += 1;//increase loss by 1 for p2
      // $('#wins1').html("Wins: " + p1Win);
      // $('#loss2').html("Lost: " + p2Lost);

    }
    else if (results === p2Choice) {
      message.text("Player two wins!");
      p2Win += 1;
      p1Lost += 1;
      // $('#wins2').html("Wins: " + p2Win);
      // $('#loss1').html("Lost: " + p1Lost);

    }

    else if (p1Choice === p2Choice) {
      message.text("It's a tie!");
    }

    $('.playerOne').append(choiceDiv1.html(p1Choice));
    $('.playerTwo').append(choiceDiv2.html(p2Choice));

    setTimeout(function () {//after 5 seconds remove and reset
      readyToPlay(snapshot)
      $('.currentChoice').remove();
      message.text("");
      clearUpdate();
    }, 3000)
  }

});


players.on("value", function (snapshot) {
  var p1Wins = snapshot.val().one.wins;
  var p2Wins = snapshot.val().two.wins;
  var p1Loss = snapshot.val().one.losses;
  var p2Loss = snapshot.val().two.losses;

  $('#wins1').html("Wins: " + p1Wins);
  $('#wins2').html("Wins: " + p2Wins);

  $('#loss1').html("Lost: " + p1Loss);
  $('#loss2').html("Lost: " + p2Loss);
 
      
});


function clearUpdate() {
  p1.update({
    "choice": "",
    "losses": p1Lost,
    "wins": p1Win
  })
  p2.update({
    "choice": "",
    "losses": p2Lost,
    "wins": p2Win
  })
}

var quitGame1;
$('.quitBtn').on("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

resetEntireGame();
  //players.remove();
 
  quitGame1 = true;

});

function resetEntireGame(){
  
  currentUser.set({
    "userid": "",
    "btn": "",
    "user": ""
  });

  //currentUser.remove();

  passUserName.set({
    "u2": "",
    "btn2": false,
    "u1": "",
    "btn1": false
  })
  passUserName.remove();

  p1.remove();
  p2.remove();
  $('.quitBtn').hide();

}


passUserName.on("value",function(snapshot){
console.log(snapshot.val());
button1=snapshot.val().btn1;
button2=snapshot.val().btn2;
console.log(button1);
console.log(button2);
if(button1==false && button2==false){
  $('.gameChoice1,.gameChoice2').hide();
  $('.playClick1,.playClick2').show();
}

});





// Run the compare function
// var results = compare(userChoice,computerChoice);
// Compare user choice vs computer choice
var compare = function (choice1, choice2) {
  // if (choice1 === choice2) {
  //   return "It's a tie!";
  // }
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
  else if (choice2 === "Scissors" && choice1 === "Paper") {
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
  $(".chatArea").append(newLine).append(chatname + ": " + chattext);
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











