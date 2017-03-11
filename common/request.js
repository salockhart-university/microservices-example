'use strict';

const http = require('http');

module.exports = {
	makeRequest: function(host, port, path, method, body, headers) {
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
			const request = http.request(options, function(result) {
				result.setEncoding('utf8');
				const body = [];
				result.on('data', function(chunk) {
					body.push(chunk);
				});
				result.on('end', function() {
					const result = Buffer.concat(body).toString();
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
}
