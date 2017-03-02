'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');

const request = require('../common/request');

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

function makeInsuranceRequest(mlsID, mortID) {
	const body = {
		mortID,
		mlsID,
		appraiseValue: Math.floor(Math.random() * 500000 + 500000)
	}
	const {
		domain,
		port
	} = config.hostnames.insinc;
	//TODO wire up to insinc once completed
	console.log('request to /insinc/realestate', JSON.stringify(body, null, 5));
	// request.makeRequest(domain, port, '/insinc/realestate', 'POST', body);
}

app.post('/re/appraisal', function(req, res) {
	//TODO: Log out that the request to re was made
	console.log('request to /re/appraisal', JSON.stringify(req.body, null, 5));

	if (!req.body.mlsID) {
		//TODO: Log out that the request to re was completed
		return res.status(400).send('Bad Request missing body parameter mlsID');
	}

	if (!req.body.mortID) {
		//TODO: Log out that the request to re was completed
		return res.status(400).send('Bad Request missing body parameter mortID');
	}

	if (!req.body.name) {
		//TODO: Log out that the request to re was completed
		return res.status(400).send('Bad Request missing body parameter name');
	}

	//TODO: Log out that the request to re was completed
	res.sendStatus(200);

	makeMunicipalRequest(req.body.mlsID, req.body.mortID);

	makeInsuranceRequest(req.body.mlsID, req.body.mortID);
});

app.listen(config.hostnames.re.port, function() {
	console.log(`Listening on port ${config.hostnames.re.port}!`);
});
