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

const possibleServices = {
	police: true,
	water: true,
	school: true,
	sewage: true
}

app.use(bodyParser.json());

app.post('/mun/appraisal', function(req, res) {
	//TODO: Log out that the request to mun was made

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

	const body = Object.assign({}, possibleServices);
	Object.keys(body).forEach(function(key) {
		body[key] = Math.random() > 0.5;
	});

	const {
		domain,
		port
	} = config.hostnames.insinc;
	request.makeRequest(domain, port, '/insinc/municipal', 'POST', body);
});

app.listen(config.hostnames.mun.port, function() {
	console.log(`Listening on port ${config.hostnames.mun.port}!`);
});
