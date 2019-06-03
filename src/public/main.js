var config  = {
    apiKey: "AIzaSyBn2hre-J325kFSMOI5Ej9ytge4i1mBv6M",
    authDomain: "split-a7e52.firebaseapp.com",
    databaseURL: "https://split-a7e52.firebaseio.com",
    projectId: "split-a7e52",
    storageBucket: "split-a7e52.appspot.com",
    messagingSenderId: "324260214592",
    appId: "1:324260214592:web:6dedf723181b22bc"
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
    if (Number.isNaN(Number.parseFloat(amount_requested))) {
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

function populateOpenRequestsTable() {
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
            tablecontents += "<td>" + doc.get('tag') + "</td>";

            if (!closed) {
                tablecontents += "<td> <input type='button' onclick=\"closeRequest('" + doc.id + "')\" class='float-right' value='Close' > </td>";
            }
            tablecontents += "</tr>";

            if (!closed) {
                opencontents = tablecontents;
            }
            document.getElementById("openRequest").innerHTML += opencontents;
        });
    });

    getRequestsTotal();
}

function populateClosedRequestsTable() {
    document.getElementById("closeRequest").innerHTML = "";
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
            tablecontents += "<td>" + doc.get('tag') + "</td>";
            tablecontents += "</tr>";

            if (closed) {
                closedcontents = tablecontents;
            }
            document.getElementById("closeRequest").innerHTML += closedcontents;
        });
    });

    getRequestsTotal();
}

function populateOpenRequestorsTable() {
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
            tablecontents += "<td>" + doc.get('tag') + "</td>";
            tablecontents += "</tr>";

            if (!closed) {
                opencontents = tablecontents;
            }
            document.getElementById("openRequestors").innerHTML += opencontents;
        });
    });

    getRequestorsTotal();
}

function populateClosedRequestorsTable() {
    document.getElementById("closeRequestors").innerHTML = "";
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
            tablecontents += "<td>" + doc.get('tag') + "</td>";
            tablecontents += "</tr>";

            if (closed) {
                closedcontents = tablecontents;
            }
            document.getElementById("closeRequestors").innerHTML += closedcontents;
        });
    });

    getRequestorsTotal();
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
                                total += doc.get("amount");
                                }
                        document.getElementById("openTotal").innerHTML = "Total Owed to You: $" + total;
                });
        });
return total;
}

function getTagsTotal() {
    var results = [];
    var closedbills = 0;
    var closedfun = 0;
    var closedfood = 0;
    var closedother = 0;

    var openbills = 0;
    var openfun = 0;
    var openfood = 0;
    var openother = 0;

    var user = getUserName();
    
    var query = firebase.firestore()
                .collection('requests')
                .where("recipient", "==", user)
                .get()
                .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            if(doc.get("closed") == true) {
                                if(doc.get("tag") == "Bills") {
                                    closedbills += doc.get("amount");
                                }
                                else if(doc.get("tag") == "Fun") {
                                    closedfun += doc.get("amount");
                                }
                                else if(doc.get("tag") == "Food") {
                                    closedfood += doc.get("amount");
                                }
                                else if(doc.get("tag") == "Other") {
                                    closedother += doc.get("amount");
                                }
                            }
                            else if(doc.get("closed") == false) {
                                if(doc.get("tag") == "Bills") {
                                    openbills += doc.get("amount");
                                }
                                else if(doc.get("tag") == "Fun") {
                                    openfun += doc.get("amount");
                                }
                                else if(doc.get("tag") == "Food") {
                                    openfood += doc.get("amount");
                                }
                                else if(doc.get("tag") == "Other") {
                                    openother += doc.get("amount");
                                }
                            }
                        });

                        google.charts.load("current", {packages:["corechart"]});
                        google.charts.setOnLoadCallback(drawChart);
                        function drawChart() {
                            var data = google.visualization.arrayToDataTable([
                                ['Tags', 'Cash Spent'],
                                ['Bills/Rent',     openbills],
                                ['Food',      openfood],
                                ['Fun',  openfun],
                                ['Other',  openother],
                            ]);

                            var options = {
                                title: 'Open Requests Breakdown',
                                is3D: true,
                            };

                            var chart = new google.visualization.PieChart(document.getElementById('openpiechart_3d'));
                            chart.draw(data, options);
                        }

                        google.charts.load("current", {packages:["corechart"]});
                        google.charts.setOnLoadCallback(drawChart2);
                        function drawChart2() {
                            var data = google.visualization.arrayToDataTable([
                                ['Tags', 'Cash Spent'],
                                ['Bills/Rent',     closedbills],
                                ['Food',      closedfood],
                                ['Fun',  closedfun],
                                ['Other',  closedother],
                            ]);

                            var options = {
                                title: 'Spending History Breakdown',
                                is3D: true,
                            };

                            var chart = new google.visualization.PieChart(document.getElementById('historypiechart_3d'));
                            chart.draw(data, options);
                        }
        });
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
                        document.getElementById("fnameForm").value = firstname;
                        document.getElementById("lnameForm").value = lastname;
                        document.getElementById("aboutForm").value = aboutMe;
                    });
                });
}

//update user profile with the data in the fields.
function updateProfile() {
    var fnameVal = document.getElementById("fnameForm").value;
    var lnameVal = document.getElementById("lnameForm").value;
    var aboutVal = document.getElementById("aboutForm").value;

    var query = firebase.firestore()
                .collection('users')
                .where("email", "==", getUserName())
                .get()
                .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            firebase.firestore().collection('users').doc(doc.id).update({
                                fname: fnameVal,
                                lname: lnameVal,
                                about: aboutVal
                                });
                        });
                    }).catch(function(error) {
                        console.error('Error writing request to Firebase Database', error);
                    });
}

function populateRecentUsers() {
    var user = getUserName();
    if (user == '') return;
    document.getElementById("recentRequestors").innerHTML = ""; 
    var query = firebase.firestore()
                        .collection('requests')
                        .where("user", "==", user)
                        .orderBy('timestamp', 'desc')
                        .limit(5)
                        .get()
                        .then(function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {
                               var contents = "<tr><td>" + doc.get('recipient') + "</td><td>" + doc.get('timestamp').toDate() + "</td></tr>";
                               document.getElementById("recentRequestors").innerHTML += contents;
                            });  
                        })
    var query2 = firebase.firestore()
                         .collection('requests')
                         .where("recipient", "==", user)
                         .orderBy('timestamp', 'desc')
                         .limit(5)
                         .get()
                         .then(function(querySnapshot) {
                             querySnapshot.forEach(function(doc) {
                                var contents = "<tr><td>" + doc.get('user') + "</td><td>" + doc.get('timestamp').toDate() + "</td></tr>";
                                document.getElementById("recentRequestors").innerHTML += contents;
                             });
                         })
}
