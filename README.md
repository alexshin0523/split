# CS180-Split


Split household bills with roommates, to figure out costs for a group vacation, or just to remember when a friend spots you for lunch, view your balances, track spending trends, set up email reminders for bills, and much more!

Scrum Document: https://docs.google.com/spreadsheets/d/19QZ39g_Ft7cF6FI-iL9Blsg731_wUvBKzk6wyrJA0eU/edit?usp=sharing

To build proper npm packages run from the root directory the command: npm i


To install firebase: npm install -g firebase-tools

Then run firebase serve, should start the localhost:5000 server. 

(If you get an authentication error make sure you're signed in, using 'firebase login'
Might need to use 'firebase login --interactive' if you're on windows)

html files are kept in the public folder

NOTE: If firebase serve isn't working, try reinstalling firebase. Delete all the firebase files:
public (folder)
.firebaserc
database.rules.json
firebase.json
firestore.indexes.json
firestore.rules
storage.rules

and then run firebase init.
check all for the firebase CLI features and then continue
use cs180-split as the directory
and just use the defaults for the rest of it.
after it's all done installing, it should have recreated all the files you just deleted.
then take the index.html in the root directory and place it in the public folder. 
then you should be able to run firebase serve