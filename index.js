// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyATkOngB-vguO3gW_rRZzjoU3aqUXGehL4",
    authDomain: "web-project-2020-eaf1c.firebaseapp.com",
    projectId: "web-project-2020-eaf1c",
    storageBucket: "web-project-2020-eaf1c.appspot.com",
    messagingSenderId: "1089753996768",
    appId: "1:1089753996768:web:bb61d14d9ec6af122c5f85"
  };

  // Initialize Firebase
  //if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  //}

  firebase.auth.Auth.Persistence.LOCAL;