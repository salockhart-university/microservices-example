'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');

const request = require('../common/request');
const common = require('../common/common');

let config;

if (process.env.NODE_ENV === "local") {
	config = require('../config/local.json');
} else {
	config = require('../config/prod.json');
}

app.use(bodyParser.json());

function makeInsuranceRequest(mlsID, mortID) {
	const body = {
		mlsID,
		mortID,
		services: {
			police: Math.random() > 0.5,
			water: Math.random() > 0.5,
			school: Math.random() > 0.5,
			sewage: Math.random() > 0.5
		}
	}
	const {
		domain,
		port
	} = config.hostnames.insinc;
	request.makeRequest(domain, port, '/insinc/municipal', 'POST', body);
}

function logAndRespond(request, response, endpoint, code, message) {
	common.logInfo("MUN", endpoint, request, code, message);
	return response.status(code).send(message);
}

app.get('/', function(req, res) {
	res.send('MUN Running');
});

app.post('/mun/appraisal', function(req, res) {
	if (!req.body.mlsID) {
		return logAndRespond(req, res, '/mun/appraisal', 400, 'Bad Request missing body parameter mlsID');
	}

	if (!req.body.mortID) {
		return logAndRespond(req, res, '/re/appraisal', 400, 'Bad Request missing body parameter mortID');
	}

	logAndRespond(req, res, '/mun/appraisal', 200, 'OK').then(function(result) {
		console.log('Logging Request OK:', JSON.stringify(result, null, 5));
	}).catch(function(err) {
		console.log('Logging Request Error:', JSON.stringify(err, null, 5));
	});

	makeInsuranceRequest(req.body.mlsID, req.body.mortID).then(function(result) {
		console.log('Insurance Request OK:', JSON.stringify(result, null, 5));
	}).catch(function(err) {
		console.log('Insurance Request Error:', JSON.stringify(err, null, 5));
	});
});

app.listen(config.hostnames.mun.port, function() {
	console.log(`MUN listening on port ${config.hostnames.mun.port}`);
});
