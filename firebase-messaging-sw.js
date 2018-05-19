importScripts("https://www.gstatic.com/firebasejs/5.0.3/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.0.3/firebase-messaging.js");

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

  var messaging = firebase.messaging();

  messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    var notificationTitle = 'Background Message Title';
    var notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
  
    return self.registration.showNotification(notificationTitle,
      notificationOptions);
  });
  // [END background_handler]