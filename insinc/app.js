var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var assert = require("assert");
var mongo = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/4145p1";
app.use(bodyParser.json());

app.post("/realestate", function(req, res){
  //log
  //store mortId, mlsId, appraiseValue in db
  //check for municipal, submitQuote if so
});

app.post("municipal", function(req, res){
  //log
  //store mortId, mlsId, array in db
  //check for realestate, submitQuote if so
});

function submitQuote(mortId){
  //send mlsId, insuranceValue, deductableValue, clientName to MBR
}

mongo.connect(url, function(err, db){
  assert.equal(null, err);
  console.log("Connected to server");
  collection = db.collection("documents");
});

app.listen(53045, function(){
  console.log("App listening on port 53045");
});