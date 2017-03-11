'use strict';

var http = require('http');

const request = require('./request');

let config;
let port;

if (process.env.NODE_ENV === "local") {
	config = require('../config/local.json');
	port = config.hostnames.log.port;
} else {
	config = require('../config/prod.json');
	port = 80;
}

module.exports = {
	logInfo: function(service, endpoint, request, response_status, response_body) {
		var body = {
			service: service,
			endpoint: endpoint,
			request_body: request.body,
			user_agent: request.headers['user-agent'],
			response_code: response_status,
			response_body: response_body
		}

		var options = {
			host: config.hostnames.log.domain,
			port: port,
			path: '/logger/log',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(JSON.stringify(body))
			}
		}

		return new Promise(function(resolve, reject) {
			const request = http.request(options, function(result) {
				result.setEncoding('utf8');
				const body = [];
				result.on('data', function(chunk) {
					body.push(chunk);
				});
				result.on('end', function() {
					const result = body.length === 0 ? '' : Buffer.concat(body).toString();
					if (result.statusCode >= 400) {
						return reject(result);
					}
					try {
						resolve(JSON.parse(result));
					} catch (err) {
						resolve(result);
					}
				});
			});
			request.on('error', function(error) {
				reject(error);
			});
			request.write(JSON.stringify(body));
			request.end();
		});
	}
};
