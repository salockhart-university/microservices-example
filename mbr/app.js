var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
var path = require('path');
const uuidV4 = require('uuid/v4');

var common = require('../common/common');

let config;

if (process.env.NODE_ENV === "local") {
	config = require('../config/local.json');
} else {
	config = require('../config/prod.json');
}


var collection;
var dburl = "mongodb://" + process.env.MBR_USER + ":" + process.env.MBR_PASSWORD + "@ds113680.mlab.com:13680/mbr_mortgage";
MongoClient.connect(dburl, function(err, db) {
  if (!err) {
    console.log("MBR connected to database");
    collection = db.collection('mortgages');
  } else {
		console.log("Unable to connect to mlab, Ensure mlab URL and credentials are correct. Exiting...");
    process.exit(1);
  }
});

var app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

var logAndRespond = function(request, response, endpoint, code, message) {
	common.logInfo("MBR", endpoint, request, code, message);
	return response.status(code).send(message);
}

app.post('/mbr/request_status', function(request, response) {
	if(request.body.mortID == undefined) {
		return logAndRespond(request, response, "/mbr/request_status", 400, 'Bad Request, missing body parameter mortID');
	} else {
		//get from collection, return object to be rendered on the frontend
		collection.find({'mortID' : request.body.mortID}).toArray(function(err, result) {
			if (err) {
				return logAndRespond(request, response, "/mbr/request_status", 500, "Database Error");
			} else if (result.length == 0) {
				return logAndRespond(request, response, "/mbr/request_status", 204, "No mortgages associated with mortID: " + request.body.mortID);
			} else {
				return logAndRespond(request, response, "/mbr/request_status", 200, JSON.stringify(result[0]));
			}
		});
	}
});

app.post('/mbr/request_mortgage', function(request, response) {
	var missing = [];
	if (request.body.name == undefined) { missing.push("name"); }
	if (request.body.mortgage_value == undefined) { missing.push("mortgage_value"); }
	if (request.body.mlsID == undefined) { missing.push("mlsID"); }
	if (missing.length != 0) {
		return logAndRespond(request, response, "/mbr/request_mortgage", 400, "Bad Request, missing body parameter(s): " + JSON.stringify(missing));
	} else {
			var new_mortID = uuidV4();
	    collection.insertOne(
				{
		      'mlsID' : request.body.mlsID,
					'name' : request.body.name,
		      'mortgage_value' : request.body.mortgage_value,
		      'mortID' : new_mortID,
					'insurance_quote': {},
					'employer_info': {}
	    	},
		    function(err, result) {
		      if (err) {
						return logAndRespond(request, response, "/mbr/request_mortgage", 500, "Database Error");
		      } else {
						return logAndRespond(request, response, "/mbr/request_mortgage", 201, JSON.stringify({ mortID : new_mortID }));
		      }
		    }
			);
	  }
});

app.post('/mbr/submit_insurance_quote', function(request, response) {
	var missing = [];
	if (request.body.mlsID == undefined) { missing.push("mlsID"); }
	if (request.body.name == undefined) { missing.push("name"); }
	if (request.body.insured_value == undefined) { missing.push("insured_value"); }
	if (request.body.deductible_value == undefined) { missing.push("deductible_value"); }
	if (missing.length != 0) {
		return logAndRespond(request, response, "/mbr/submit_insurance_quote", 400, "Bad Request, missing body parameter(s): " + JSON.stringify(missing));
	} else {
		collection.updateOne(
			{ 'mlsID' : request.body.mlsID, 'name': request.body.name },
			{ $set: { 'insurance_quote' : {
				'insured_value' : request.body.insured_value,
				'deductible_value' : request.body.deductible_value
			}}},
			function(err, result) {
				if (err) {
					return logAndRespond(request, response, "/mbr/submit_insurance_quote", 500, "Database Error");
	      } else if (result.n != 0) {
					return logAndRespond(request, response, "/mbr/submit_insurance_quote", 201, JSON.stringify(result));
	      } else {
					return logAndRespond(request, response, "/mbr/submit_insurance_quote", 400, "No mortgage found associated with name:" + request.body.name + ", and mlsID: " + request.body.mlsID + ".");
				}
			}
		);
	}
});

app.post('/mbr/submit_employer_info', function(request, response) {
	var missing = [];
	if (request.body.mortID == undefined) { missing.push("mortID"); }
	if (request.body.name == undefined) { missing.push("name"); }
	if (request.body.salary == undefined) { missing.push("salary"); }
	if (request.body.employment_start == undefined) { missing.push("employment_start"); }
	if (missing.length != 0) {
		return logAndRespond(request, response, "/mbr/submit_employer_info", 400, "Bad Request, missing body parameter(s): " + JSON.stringify(missing));
	} else {
		collection.updateOne(
			{ 'mortID' : request.body.mortID, 'name': request.body.name },
			{ $set: { 'employer_info' : {
				'salary' : request.body.salary,
				'employment_start' : request.body.employment_start,
			}}},
			function(err, result) {
				if (err) {
					return logAndRespond(request, response, "/mbr/submit_employer_info", 500, "Database Error");
				} else if (result.n != 0) {
					return logAndRespond(request, response, "/mbr/submit_employer_info", 201, JSON.stringify(result));
				} else {
					return logAndRespond(request, response, "/mbr/submit_employer_info", 400, "No mortgage found associated with name:" + request.body.name + ", and mortID: " + request.body.mortID + ".");
				}
			}
		);
	}
});

app.listen(config.hostnames.mbr.port, function() {
  console.log('MBR listening on port ' + config.hostnames.mbr.port);
});
