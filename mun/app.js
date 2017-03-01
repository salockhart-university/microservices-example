'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');

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

	if (!req.body.MlsID) {
		//TODO: Log out that the request to mun was completed
		return res.status(400).send('Bad Request missing body parameter MlsID');
	}

	if (!req.body.MortID) {
		//TODO: Log out that the request to mun was completed
		return res.status(400).send('Bad Request missing body parameter MortID');
	}

	//TODO: Log out that the request to mun was completed
	res.sendStatus(200);

	const body = Object.assign({}, possibleServices);
	Object.keys(body).forEach(function(key) {
		body[key] = Math.random() > 0.5;
	})

	const options = {
		host: config.hostnames.insinc.domain,
		port: config.hostnames.insinc.port,
		path: '/insinc/municipal',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(JSON.stringify(body))
		}
	};

	return new Promise(function(resolve, reject) {
		const request = http.request(options, function(result) {
			result.setEncoding('utf8');
			result.on('data', function(chunk) {
				if (result.statusCode >= 400) {
					return reject(chunk);
				}
				resolve(JSON.parse(chunk));
			});
		});

		request.write(JSON.stringify(body));
		request.end();
	});
});

app.listen(config.hostnames.mun.port, function() {
	console.log(`Listening on port ${config.hostnames.mun.port}!`);
});
