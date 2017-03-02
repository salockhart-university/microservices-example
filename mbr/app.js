var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
const uuidV4 = require('uuid/v4');

let config;

if (process.env.NODE_ENV === "local") {
	config = require('../config/local.json');
} else {
	config = require('../config/prod.json');
}

//Get Mlab setup for db

// var collection;
// var dburl = 'mongodb://localhost:27017/ass3';
// MongoClient.connect(dburl, function(err, db) {
//   if (!err) {
//     console.log("Connected successfully to database");
//     collection = db.collection('mortgages');
//   } else {
//     process.exit(1);
//   }
// });

var app = express();
app.use(bodyParser.json());

app.post('/mbr/request_status', function(request, response) {

});

app.post('/mbr/request_mortgage', function(request, response) {

});

app.post('/mbr/submit_employer_info', function(request, response) {

});

app.post('/mbr/submit_insurance_quote', function(request, response) {

});

app.listen(config.hostnames.mbr.port, function() {
  console.log('Listening on port ' + config.hostnames.mbr.port)
}
