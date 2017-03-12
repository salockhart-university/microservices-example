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

app.use(express.static('public'));

function makeMunicipalRequest(mlsID, mortID) {
	const body = {
		mlsID,
		mortID
	};
	const {
		domain,
		port
	} = config.hostnames.mun;
	return request.makeRequest(domain, port, '/mun/appraisal', 'POST', body);
}

function makeInsuranceRequest(mlsID, mortID, name) {
	const body = {
		mortID,
		mlsID,
		name,
		appraiseValue: Math.floor(Math.random() * 500000 + 500000)
	}
	const {
		domain,
		port
	} = config.hostnames.insinc;
	return request.makeRequest(domain, port, '/insinc/realestate', 'POST', body);
}

function logAndRespond(request, response, endpoint, code, message) {
	common.logInfo("RE", endpoint, request, code, message).then(function(result) {
		console.log('Logging Request OK:', JSON.stringify(result, null, 5));
	}).catch(function(err) {
		console.log('Logging Request Error:', JSON.stringify(err, null, 5));
	});
	return response.status(code).send(message);
}

app.post('/re/appraisal', function(req, res) {
	if (!req.body.mlsID) {
		return logAndRespond(req, res, '/re/appraisal', 400, 'Bad Request missing body parameter mlsID');
	}

	if (!req.body.mortID) {
		return logAndRespond(req, res, '/re/appraisal', 400, 'Bad Request missing body parameter mortID');
	}

	if (!req.body.name) {
		return logAndRespond(req, res, '/re/appraisal', 400, 'Bad Request missing body parameter name');
	}

	Promise.all([
		makeMunicipalRequest(req.body.mlsID, req.body.mortID),
		makeInsuranceRequest(req.body.mlsID, req.body.mortID, req.body.name)
	]).then(function(result) {
		logAndRespond(req, res, '/re/appraisal', 200, 'OK');
	}).catch(function(err) {
		logAndRespond(req, res, '/re/appraisal', 400, err);
	});
});

app.listen(config.hostnames.re.port, function() {
	console.log(`RE listening on port ${config.hostnames.re.port}`);
});
