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
	//TODO wire up to insinc once completed
	console.log('request to /insinc/municipal', JSON.stringify(body, null, 5));
	// request.makeRequest(domain, port, '/insinc/municipal', 'POST', body);
}

app.post('/mun/appraisal', function(req, res) {
	//TODO: Log out that the request to mun was made
	console.log('request to /mun/appraisal', JSON.stringify(req.body, null, 5));

	if (!req.body.mlsID) {
		//TODO: Log out that the request to mun was completed
		return res.status(400).send('Bad Request missing body parameter mlsID');
	}

	if (!req.body.mortID) {
		//TODO: Log out that the request to mun was completed
		return res.status(400).send('Bad Request missing body parameter mortID');
	}

	//TODO: Log out that the request to mun was completed
	res.sendStatus(200);

	makeInsuranceRequest(req.body.mlsID, req.body.mortID);
});

app.listen(config.hostnames.mun.port, function() {
	console.log(`Listening on port ${config.hostnames.mun.port}!`);
});
