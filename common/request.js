'use strict';

const http = require('http');
const https = require('https');

module.exports = {
	makeRequest: function(host, port, path, method, body, headers, secure) {
		body = body || {};

		// http://stackoverflow.com/questions/6158933/how-to-make-an-http-post-request-in-node-js
		const options = {
			host,
			port: process.env.NODE_ENV === "local" ? port : 80,
			path,
			method,
			headers: Object.assign({}, headers, {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(JSON.stringify(body)),
				'user-agent': 'microservice'
			})
		};

		return new Promise(function(resolve, reject) {
      const protocol = secure ? https : http;
			const request = protocol.request(options, function(result) {
				result.setEncoding('utf8');
				let data = [];
				result.on('data', function(chunk) {
					data.push(chunk);
				});
				result.on('end', function() {
					data = "".concat.apply(data);
					if (result.statusCode >= 400) {
						return reject(data);
					}
					try {
						resolve(JSON.parse(data));
					} catch (err) {
						resolve(data);
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
}
