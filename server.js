'use strict';

// IMPORT EXTERNAL LIBS AND SET UP CONFIGURATION FOR SERVER

// import web framework and db libs that will be used
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
// enable cors for security reasons, node/express boilerplate
var cors = require('cors');
// import bodyparser middleware so we can access form response
const bodyParser = require('body-parser');
// import lib to interact with env file, other examples didn't need this, not sure why I did.
require('dotenv').config();

var app = express();

// basic configuration 
var port = process.env.PORT || 3000;

// connect to the db with the mongo token in the private env file
mongoose.connect(process.env.MONGO_URI)

// bodyparser config that will allow us to access url submitted in the front-end form
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': false}));

app.use(cors());

// start the server
app.listen(port, function () {
  console.log('Node.js listening ...');
});

// SCHEMA LOGIC FOR STORING URL OBJECTS

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    original_url: {
        type: String,
        required: true
    },
    short_url: {
        type: String
    }
});

const Item = mongoose.model('item', ItemSchema);

// APP LOGIC FOR OUR ENDPOINTS

// look in the public folder for which front-end pages to load by default
app.use('/public', express.static(process.cwd() + '/public'));

// load our index page when user navigates to landing page
app.get('/', function(req, res){
  var url = req.body.url
  res.sendFile(process.cwd() + '/views/index.html');
});

// endpoint that is hit when user selects submit button in front-end
app.post('/api/shorturl/new', function(req, res) {
  
  // access the url from the form body
  var url = req.body.url

  // simple regex test for valid url, didn't implement dns lookup
  // example: success
  //   "https://www.freecodecamp.org"
  //   "www.freecodecamp.org"
  //   "freecodecamp.org"
  // example: fails
  //   "www.freecodecamp"
  // example: edge case
  //   regex test / db lookup doesn't differentiate if 'www' or 'http:' is present. 
  //   example: https://www.freecodecamp.org & www.freecodecamp.org & freecodecamp.org will create 3 db entries
  //   all 3 of the above examples resolves successfully to the correct site
  var regex =/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  
  // display error to user if they don't submit a url that is part of our valid format
  if (regex.test(url)!==true) {
    res.json({"error": "invalid URL"})
  } 
  
  // if url is valid, decide how to handle it
  else{ 
    //check db to see if we already have an entry
    Item.findOne({"original_url": url}, function(err, storedItem) {
      //if we do, return it
      if (storedItem) {
        res.json({"original_url": url, "short_url": storedItem.short_url});
      } 
      //if we don't, create a new one
      else {
        // create simple short code. known edge case, we don't check for existing short codes in db. 
        // we would need to get unlucky to get the same one in 100,000 options
        var short = Math.floor(Math.random()*100000).toString()
        
        // instantiate new url object with url and short code
        const newItem = new Item({
          original_url: url,
          short_url: short
        });
        // save the new object to the db
        newItem.save().then(item => res.json(item));
        // display the new object to the user so they can access the short code
        res.json(newItem)
      }
    })
  }
})

// endpoint that is hit when user wants to redirect via shortcode
app.get('/api/shorturl/:urlToForward', function(req, res, next) {

  // capture the url supplied from the user in the url
  var shorterUrl = req.params.urlToForward
  
  // look up the item in the db via it's shortcode
  Item.findOne({'short_url' : shorterUrl}, (err, data) => {
    if (err) return res.send('Error reading database');    
    // when found, just redirect to the original url of the object
    res.redirect(301, data.original_url)
  })
})