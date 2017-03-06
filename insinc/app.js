var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var assert = require("assert");
var mongo = require("mongodb").MongoClient;
var restClient = require("node-rest-client").Client;
var dbUrl = "mongodb://localhost:27017/4145p1";
var logUrl = "";  //to do: determine url
var mbrUrl = ""; //to do: determine url
var reCollection, munCollection;
app.use(bodyParser.json());

//accept info from RE
app.post("/realestate", function(req, res){
  //add realestate info to db
  if(req.body.mortID == null||
     req.body.mlsID == null||
     req.body.appraiseValue == null){
    log("/realestate", req.headers['user-agent'], req.body, 400, "Bad Request");
    res.sendStatus(400);
  }
  else{
    reCollection.find({
      mortID : req.body.mortID
    }).toArray(function(err, result){
      assert.equal(err, null);
      if(result.length <= 0){
        reCollection.insert({
          mortID : req.body.mortID,
          mlsID : req.body.mlsID,
          appraiseValue : req.body.appraiseValue,
          name : req.body.name
        });
      }
    });

    //submit quote if municipal info exists
    munCollection.find({
      mortID : req.body.mortID
    }).toArray(function(err, result){
      assert.equal(err, null);
      if(result.length > 0){
        submitQuote(req.body.mlsID, req.body.name);
      }
    });

    log("/realestate", req.headers['user-agent'], req.body, 200, "OK");
    res.sendStatus(200);
  }
});

//accept info from MUN
app.post("/municipal", function(req, res){
  //add municipal info to db
  if(req.body.mortID == null||
     req.body.mlsID == null||
     req.body.services == null){
    log("/municipal", req.headers['user-agent'], req.body, 400, "Bad Request");
    res.sendStatus(400);
  }
  else{
    munCollection.find({
      mortID : req.body.mortID
    }).toArray(function(err, result){
      assert.equal(err, null);
      if(result.length <= 0){
        munCollection.insert({
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
        submitQuote(req.body.mlsID, result.name);
      }
    });

    log("/municipal", req.headers['user-agent'], req.body, 200, "OK");
    res.sendStatus(200);
  }
});

//send quote to MBR
function submitQuote(mlsID, name){
  var client = new restClient();
  var payload = {
    mlsID : mlsID,
    insured_value : Math.floor(Math.random() * 100),
    deductable_value : Math.floor(Math.random() * 100),
    name : name
  };
  var args = {
    headers: {"content-type": "application/json"},
    data: JSON.stringify(payload)
  };
  client.post(mbrUrl, args);
}

//send log info to logger
function log(endpoint, user_agent, request_body, request_code, response_body){
  var client = new restClient();
  var payload = {
    service : "INSinc",
    endpoint : endpoint,
    user_agent : user_agent,
    request_body : request_body,
    request_code : request_code,
    response_body : response_body
  }
  var args = {
    headers: {"content-type": "application/json"},
    data: JSON.stringify(payload)
  };
  client.post(logUrl, args);
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

//testing functions
app.get("/relist", function(req, res){
  reCollection.find({}).toArray(function(err, result){
    assert.equal(err, null);
    res.send(result);
  });
});

app.get("/munlist", function(req, res){
  munCollection.find({}).toArray(function(err, result){
    assert.equal(err, null);
    res.send(result);
  });
});

app.delete("/redelete", function(req, res){
  reCollection.remove({}, function(err, result){
    assert.equal(err, null);
    res.send(result);
  });
});

app.delete("/mundelete", function(req, res){
  munCollection.remove({}, function(err, result){
    assert.equal(err, null);
    res.send(result);
  });
});