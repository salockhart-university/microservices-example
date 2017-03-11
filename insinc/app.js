var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
var assert = require("assert");
var mongo = require("mongodb").MongoClient;
var dbUrl = "mongodb://" + process.env.INSINC_USER + ":"
  + process.env.INSINC_PASSWORD + "@ds119250.mlab.com:19250/insincdb";
var reCollection, munCollection;
let config;
if (process.env.NODE_ENV === "local") {
	config = require('../config/local.json');
} else {
	config = require('../config/prod.json');
}
const common = require('../common/common');
const request = require('../common/request');

mongo.connect(dbUrl, function(err, db){
  assert.equal(null, err);
  console.log("INSINC connected to database");
  reCollection = db.collection("realestate");
  munCollection = db.collection("municipal");
});

app.listen(config.hostnames.insinc.port, function(){
  console.log(`INSINC listening on port ${config.hostnames.insinc.port}`);
});

//accept info from RE
app.post("/insinc/realestate", function(req, res){
  //add realestate info to db
  if( req.body.mortID == null||
      req.body.mlsID == null||
      req.body.appraiseValue == null||
      req.body.name == null){
    return log(req, res, "/insinc/realestate", 400, "Bad Request");
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
        submitQuote(req.body.mortID, req.body.name);
      }
    });

    return log(req, res, "/insinc/realestate", 200, "OK");
  }
});

//accept info from MUN
app.post("/insinc/municipal", function(req, res){
  //add municipal info to db
  if(req.body.mortID == null||
     req.body.mlsID == null||
     req.body.services == null){
    return log(req, res, "/insinc/municipal", 400, "Bad Request");
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
        submitQuote(req.body.mortID, result[0].name);
      }
    });

    return log(req, res, "/insinc/municipal", 200, "OK");
  }
});

//send quote to MBR
function submitQuote(mortID, name){
  const body = {
    mortID,
    insured_value : Math.floor(Math.random() * 100),
    deductible_value : Math.floor(Math.random() * 100),
    name
  };
  const{
    domain,
    port
  } = config.hostnames.mbr;
  request.makeRequest(domain, port, "/mbr/submit_insurance_quote", "POST", body);
}

//send log info to logger
function log(request, response, endpoint, code, message) {
	common.logInfo("INSinc", endpoint, request, code, message);
	return response.status(code).send(message);
}

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
