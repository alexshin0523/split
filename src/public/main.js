// Save a new request to Firebase
function saveRequest(sender_name, recipient_name, amount_requested, request_memo) {
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
	        timestamp: firebase.firestore.FieldValue.serverTimestamp()
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
                                    .get()
                                    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            tablecontents = "";
            tablecontents += "<tr>";
            tablecontents += "<td>" + doc.get('recipient') + "</td>";
            tablecontents += "<td>" + doc.get('amount') + "</td>";
            tablecontents += "<td>" + doc.get('message') + "</td>";
            tablecontents += "</tr>";
            closed = doc.get('closed');
            
            if (closed) {
                closedcontents = tablecontents;
            } else {
                opencontents = tablecontents;
            }
            document.getElementById("closeRequest").innerHTML += closedcontents;    
            document.getElementById("openRequest").innerHTML += opencontents;            
        });
    });
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
  var username = firebase.auth().currentUser.email;
  console.log(username);
  return username;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

//var requestFormElement = document.getElementById('requestform');
//requestFormElement.addEventListener('requestbutton', onRequestFormSubmit);
