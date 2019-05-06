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


UPDATE: got the request page to pull data from the actual fields. run it the same as before using firebase serve and then the default page should be the create request page.

i commented out matthew's UI because all the inputs were contained in one single huge <form> tag which contained a bunch of labels and inputs. i'm sure there's a way to pull the data from those inputs but i couldn't figure out a way to do it. so instead i created a <form> for each of the individual input fields and used document.GetElementById() to fetch the inputs. once we figure out how to get the data from that giant form, we can go back to using matthew's UI.

TODO: find a way to stop the database from inserting a request if the fields are wrong. (ex. if they're all blank and you press submit, it'll just create a blank entry in the database)

TODO: reset the fields after submitting (ex. after you press submit all the data is still there. so if you press it again on accident it'll create a second request with all the same data but a different timestamp since we're using firebase's built in timestamp)

TODO: find a way to check if a user exists in the database before making an entry. (ex. if i request from a user that doesn't exist, it'll create the entry anyway because right now we don't really have a user database)

TODO: figure out how we're going to handle accounts. right now we have a google login, but it doesn't create an entry in the database. it's stored somewhere else in firebase (under authentication->users but i'm not sure how we're going to access that)  

NOTE: probably going to end up replacing "your name" and "recipient's name" to something like "your username" and "recipient's username" because peoples' names aren't unique. we should be storing everyone's names in the user section of the database so when we display to users we can still display their names nicely, but we'll still have their unique username info in each request.

TODO: actually link the login page to some sort of dashboard page, and then have a link to the create request page

Sprint 2 Stories:
  Close Requests
  Display total owed by user
  Display all requests involving user
