var config = {
         apiKey: "AIzaSyAzE7sVPreEJK2dI_BTMTUVntz1E_O0wK0",
         authDomain: "cs180-split.firebaseapp.com",
         databaseURL: "https://cs180-split.firebaseio.com",
         projectId: "cs180-split",
         storageBucket: "cs180-split.appspot.com",
         messagingSenderId: "638604999532"
     };
firebase.initializeApp(config);

var currUserEmail;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currUserEmail = user.email;
        saveUser(currUserEmail);
    }
    else {
        currUserEmail = "";
    }
});


// Save a new request to Firebase
function saveRequest(sender_name, recipient_name, amount_requested, request_memo, request_tag) {
    // Check if amount requested is an integer
    if (!Number.isInteger(amount_requested)) {
        console.error('Amount requested is not integer');
        return false;
    }
    // Check if recipient exists
    // Not possible with current firebase setup :(

    return firebase.firestore().collection('requests').add({
	        user: sender_name,
	        recipient: recipient_name,
            amount: amount_requested,
            message: request_memo,
            closed: false,
            tag: request_tag,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function(result){
            console.log(result)
            window.location = 'requestT.html';
        }).catch(function(error) {
	        console.error('Error writing request to Firebase Database', error);
        });
}

function populateRequestsTable() {
    document.getElementById("closeRequest").innerHTML = "";
    document.getElementById("openRequest").innerHTML = "";
    var closed = false;

    var user = getUserName();
    var tablecontents = "";
    var closedcontents = "";
    var opencontents = "";

    var query = firebase.firestore().collection('requests')
                                    .where("user", "==", user)
                                    .orderBy('timestamp', 'desc')
                                    .get()
                                    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            closed = doc.get('closed');
            closedcontents = "";
            opencontents = "";
            tablecontents = "";
            tablecontents += "<tr>";
            tablecontents += "<td>" + doc.get('recipient') + "</td>";
            tablecontents += "<td>" + doc.get('amount') + "</td>";
            tablecontents += "<td>" + doc.get('message') + "</td>";

            if (!closed) {
                tablecontents += "<td> <input type='button' onclick=\"closeRequest('" + doc.id + "')\" class='float-right' value='Close' > </td>";
            }
            tablecontents += "</tr>";

            if (closed) {
                closedcontents = tablecontents;
            } else {
                opencontents = tablecontents;
            }
            document.getElementById("closeRequest").innerHTML += closedcontents;
            document.getElementById("openRequest").innerHTML += opencontents;
        });
    });

    getRequestsTotal();
}

function populateRequestorsTable() {
    document.getElementById("closeRequestors").innerHTML = "";
    document.getElementById("openRequestors").innerHTML = "";
    var closed = false;

    var user = getUserName();
    var tablecontents = "";
    var closedcontents = "";
    var opencontents = "";

    var query = firebase.firestore().collection('requests')
                                    .where("recipient", "==", user)
                                    .orderBy('timestamp', 'desc')
                                    .get()
                                    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            closed = doc.get('closed');
            closedcontents = "";
            opencontents = "";
            tablecontents = "";
            tablecontents += "<tr>";
            tablecontents += "<td>" + doc.get('user') + "</td>";
            tablecontents += "<td>" + doc.get('amount') + "</td>";
            tablecontents += "<td>" + doc.get('message') + "</td>";
            tablecontents += "</tr>";

            if (closed) {
                closedcontents = tablecontents;
            } else {
                opencontents = tablecontents;
            }
            document.getElementById("closeRequestors").innerHTML += closedcontents;
            document.getElementById("openRequestors").innerHTML += opencontents;
        });
    });

    getRequestsTotal();
}

function getRequestIDs(user) {
  // Returns results for a query where user field in the table is equal to user variable passed in
  // Much more advanced queries are possible if needed
  var results = [];
  var query = firebase.firestore()
                .collection('requests')
                .where("user", "==", user)
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
              results.push(doc.id);
    		});
  });
  return results;
}

function getOpenRequestIDs(user) {
    return getRequestIDs(user);
}

function getClosedRequestIDs(user) {
    return getRequestIDs(user);
}

// Returns the passed in field for the specified doc id.
// Example usage getRequestField('doc1', 'amount') returns amount field for doc1.
function getRequestField(id, field) {
    return firebase.firestore().collection('requests').doc(id).get(field);
}

function closeRequest(id) {
    var reqRef = firebase.firestore().collection('requests').doc(id);
    reqRef.update({
        closed: true
    })
    .then(function() {
        console.log("Doc ", id, " closed successfully.");
    })
    .catch(function(error) {
        console.error("Could not close document ", id);
    });
}

function getRequestsTotal() {
    var total = 0;
    var user = getUserName();
    if(!user) {
        document.getElementById("openTotal").innerHTML = "Total Owed to You: $0";
        return;
    }
    var query = firebase.firestore()
                .collection('requests')
                .where("user", "==", user)
                .get()
                .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                                if(doc.get("closed") == false) {
                                total += parseInt(doc.get("amount"));
                                }
                        document.getElementById("openTotal").innerHTML = "Total Owed to You: $" + total;
                });
        });
return total;
}

function getRequestorsTotal() {
    var total = 0;
    var user = getUserName();
    if(!user) {
        document.getElementById("openTotaluo").innerHTML = "Total You Owe: $0";
        return;
    }
    var query = firebase.firestore()
                .collection('requests')
                .where("recipient", "==", user)
                .get()
                .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                                if(doc.get("closed") == false) {
                                total += parseInt(doc.get("amount"));
                                }
                        document.getElementById("openTotaluo").innerHTML = "Total You Owe: $" + total;
                });
        });
return total;
}

function saveUser(useremail) {
  var query = firebase.firestore()
                .collection('users')
                .where("email", "==", useremail)
                .get()
                .then(function(querySnapshot) {
                    if(!querySnapshot.empty) {return;}
                    else {
                        return firebase.firestore().collection('users').add({
                                    fname: '',
                                    lname: '',
                                    about: '',
                                    email: useremail,
                                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                        }).catch(function(error) {
                            console.error('Error writing request to Firebase Database', error);
                        });
                    }
                });
}

function signOut(){
  // Sign out of Firebase.
  firebase.auth().signOut();
}


function initFirebaseAuth() {
  //Listen to auth state changes.
  firebase.auth().onAuthStateChanged(authStateObserver);
}

function getUserName() {
  return currUserEmail;
}



// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

//to display welcome message at top of dashboard.
function displayWelcomeMessage() {
    var user = getUserName();

    document.getElementById("welcomeMessage").innerHTML = "Welcome, " + user;
}

function displayUser() {
    var user = getUserName();

    var query = firebase.firestore()
                .collection('users')
                .where("email", "==", user)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        firstname = doc.get("fname");
                        lastname = doc.get("lname");
                        aboutMe = doc.get("about");
                        document.getElementById("useremail").innerHTML = user;
                        document.getElementById("userfullname").innerHTML = firstname + " " + lastname;
                        document.getElementById("useraboutme").innerHTML = aboutMe;
                    });
                });
}
/*
function displayUser() {
    var user = getUserName();

    document.getElementById("username").innerHTML = user;
}
*/

//delete currently signed in user
function deleteUser() {
    var user = firebase.auth().currentUser;

    user.delete().then(function() {
    // User deleted.
    console.log("User deleted successfully.");
    window.location="deleteT.html";
    }).catch(function(error) {
    // An error happened.
    console.log("An error occured.");
    console.log(error);
    });
}

//grab user info to display on user.html
function populateUserProfile() {
    var user = getUserName();
    var firstname = "";
    var lastname = "";
    var aboutMe = "";
    var query = firebase.firestore()
                .collection('users')
                .where("email", "==", user)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        firstname = doc.get("fname");
                        lastname = doc.get("lname");
                        aboutMe = doc.get("about");
                        document.getElementById("firstname").value = firstname;    
                        document.getElementById("lastname").value = lastname;
                        document.getElementById("aboutme").value = aboutMe;
                    });
                });
}

//update user profile with the data in the fields.
function updateProfile() {

}