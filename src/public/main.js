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

function loadRequests(user) {
  // Returns results for a query where user field in the table is equal to user variable passed in
  // Much more advanced queries are possible if needed
  var query = firebase.firestore()
                .collection('requests')
                .where("user", "==", user)
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
        			// do stuff with message
				console.log("user: ", doc.get("user"));
        			console.log("read comment: ", doc.get("message"));
    		});
	});
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
