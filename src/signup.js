var firebase = require("firebase");

firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    //handle errors here
    var errorCode = error.code;
    var errorMessage = error.message;
});