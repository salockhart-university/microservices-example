var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var assert = require("assert");
var mongo = require("mongodb").MongoClient;
var restClient = require("node-rest-client").Client;
var dbUrl = "mongodb://localhost:27017/4145p1";
var logUrl = "";  //logger method url
var mbrUrl = "/mbr/submit_insurance_quote"; //complete this
var reCollection, munCollection;
app.use(bodyParser.json());

//accept info from RE
app.post("/realestate", function(req, res){
  //log

  //add realestate info to db
  reCollection.find({
    mortID : req.body.mortID
  }).toArray(function(err, result){
    assert.equal(err, null);
    if(result.length > 0){
      reCollection.insert({
        mortID : req.body.mortID,
        mlsID : req.body.mlsID,
        appraiseValue : req.body.appraiseValue
      });
    }
  });

  //submit quote if municipal info exists
  munCollection.find({
    mortID : req.body.mortID
  }).toArray(function(err, result){
    assert.equal(err, null);
    if(result.length > 0){
      submitQuote(req.body.mlsID);
    }
  });

  res.sendStatus(200);
});

//accept info from MUN
app.post("/municipal", function(req, res){
  //log

  //add municipal info to db
  munCollection.find({
    mortID : req.body.mortID
  }).toArray(function(err, result){
    assert.equal(err, null);
    if(result.length > 0){
      reCollection.insert({
        mortID : req.body.mortID,
        mlsID : req.body.mlsID,
        services : req.body.services
      });
    }
  });

  //submit quote if realestate info exists
  reCollection.find({
    mortID : req.body.mortID
  }).toArray(function(err, result){
    assert.equal(err, null);
    if(result.length > 0){
      submitQuote(req.body.mlsID);
    }
  });

  res.sendStatus(200);
});

//sends quote to MBR
function submitQuote(mlsID){
  var client = new restClient();
  var payload = {
    mlsID : mlsID,
    insured_value : 0,
    deductable_value : 0,
    name : "bob"
  };
  var args = {
    headers: {"content-type": "application/json"},
    data: JSON.stringify(payload)
  };

  client.post(mbrUrl, args);
}

function log(){
  //send stuff to logUrl
}

mongo.connect(dbUrl, function(err, db){
  assert.equal(null, err);
  console.log("Connected to server");
  reCollection = db.collection("realestate");
  munCollection = db.collection("municipal");
});

app.listen(53045, function(){
  console.log("App listening on port 53045");
});