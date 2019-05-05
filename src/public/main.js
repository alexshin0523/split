// Save a new request to Firebase 
function saveRequest(sender_name, recipient_name, amount_requested, request_memo) {
  return firebase.firestore().collection('requests').add({
	user: sender_name,
	recipient: recipient_name,
  amount: amount_requested,
  message: request_memo,
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

//var requestFormElement = document.getElementById('requestform');
//requestFormElement.addEventListener('requestbutton', onRequestFormSubmit);