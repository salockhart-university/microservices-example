var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var assert = require("assert");
var mongo = require("mongodb").MongoClient;
var restClient = require("node-rest-client").Client;
var dbUrl = "mongodb://" + process.env.INSINC_USER + ":"
  + process.env.INSINC_PASSWORD + "@ds119250.mlab.com:19250/insincdb";
var reCollection, munCollection;
app.use(bodyParser.json());
let config;
if (process.env.NODE_ENV === "local") {
	config = require('../config/local.json');
} else {
	config = require('../config/prod.json');
}
const common = require('../common/common');

//accept info from RE
app.post("/insinc/realestate", function(req, res){
  //add realestate info to db
  if(req.body.mortID == null||
     req.body.mlsID == null||
     req.body.appraiseValue == null){
    log(req, res, "/insinc/realestate", 400, "Bad Request");
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

    log(req, res, "/insinc/realestate", 200, "OK");
    res.sendStatus(200);
  }
});

//accept info from MUN
app.post("/insinc/municipal", function(req, res){
  //add municipal info to db
  if(req.body.mortID == null||
     req.body.mlsID == null||
     req.body.services == null){
    log(req, res, "/insinc/municipal", 400, "Bad Request");
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

    log(req, res, "/insinc/municipal", 200, "OK");
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
  const{
    domain,
    port
  } = config.hostnames.mbr;
  var mbrUrl = domain+":"+port+"/mbr/submit_insurance_quote";
  client.post(mbrUrl, args);
}

//send log info to logger
function log(request, response, endpoint, code, message) {
	common.logInfo("INSinc", endpoint, request, code, message);
	return response.status(code).send(message);
}

mongo.connect(dbUrl, function(err, db){
  assert.equal(null, err);
  console.log("INSINC connected to database");
  reCollection = db.collection("realestate");
  munCollection = db.collection("municipal");
});

app.listen(config.hostnames.insinc.port, function(){
  console.log(`INSINC listening on port ${config.hostnames.insinc.port}`);
});

//testing functions
app.get("/insinc/relist", function(req, res){
  reCollection.find({}).toArray(function(err, result){
    assert.equal(err, null);
    res.send(result);
  });
});

app.get("/insinc/munlist", function(req, res){
  munCollection.find({}).toArray(function(err, result){
    assert.equal(err, null);
    res.send(result);
  });
});

app.delete("/insinc/redelete", function(req, res){
  reCollection.remove({}, function(err, result){
    assert.equal(err, null);
    res.send(result);
  });
});

app.delete("/insinc/mundelete", function(req, res){
  munCollection.remove({}, function(err, result){
    assert.equal(err, null);
    res.send(result);
  });
});
