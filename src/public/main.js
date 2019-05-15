// Save a new request to Firebase
function saveRequest(sender_name, recipient_name, amount_requested, request_memo) {
  return firebase.firestore().collection('requests').add({
	user: sender_name,
	recipient: recipient_name,
  amount: amount_requested,
  message: request_memo,
  closed: false,
	timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function(error) {
	console.error('Error writing request to Firebase Database', error);
    });
}

function populateRequestsTable(user, closed) {
    var reqIDs;
    var table;
    if (closed) {
        reqIDs = getOpenRequestIDs(user);
        table = "closedRequests";
    } else {
        reqIDs = getClosedRequestIDs(user);
        table = "openRequests";
    }

    var tablecontents = "";

    for (let i = 0; i < reqIDs.length; i++) {
        tablecontents += "<tr>";
        tablecontents += "<td>" + getRequestField(reqIDs[i], 'recipient') + "</td>";
        tablecontents += "<td>" + getRequestField(reqIDs[i], 'amount') + "</td>";
        tablecontents += "<td>" + getRequestField(reqIDs[i], 'message') + "</td>";
        tablecontents += "</tr>";
    }
    document.getElementById(table).innerHTML += tablecontents;
}

function populateOpenRequestsTable(user) {
    populateRequestsTable(user, false);
}

function populateClosedRequestsTable(user) {
    populateRequestsTable(user, true);
}

function getRequestIDs(user, closed) {
  // Returns results for a query where user field in the table is equal to user variable passed in
  // Much more advanced queries are possible if needed
  var results = [];
  var query = firebase.firestore()
                .collection('requests')
                .where("user", "==", user)
                .where("closed", "==", closed)
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
              results.push(doc.id);
    		});
  });
  return results;
}

function getOpenRequestIDs(user) {
    return getRequestIDs(user, false);
}

function getClosedRequestIDs(user) {
    return getRequestIDs(user, true);
}

// Returns the passed in field for the specified doc id.
// Example usage getRequestField('doc1', 'amount') returns amount field for doc1.
function getRequestField(id, field) {
    return firebase.firestore().collection('requests').doc(id).get(field);
}

function getRequestsTotal(user) {
var total = 0;

var query = firebase.firestore()
                .collection('requests')
                .where("user", "==", user)
                .get()
                .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                                total += parseInt(doc.get("amount"));
                                console.log("curr total: ", total);
                });
        });	
return total;
}

function saveUser(fullname, useremail) {
  return firebase.firestore().collection('users').add({
  name: fullname,
  email: useremail,
	timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function(error) {
	console.error('Error writing request to Firebase Database', error);
    });
}

function onRequestFormSubmit(e) {
  e.preventDefault();
  // Will probably want to add some check on data that is passed in
  // Pass Data to saveRequest
  saveRequest("test1", "test2", 1, "test3");
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
  var username = firebase.auth().currentUser.displayName;
  console.log(username);
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

//var requestFormElement = document.getElementById('requestform');
//requestFormElement.addEventListener('requestbutton', onRequestFormSubmit);
