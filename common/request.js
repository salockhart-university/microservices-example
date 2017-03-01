'use strict';

const http = require('http');

module.exports = {
    makeRequest: function(host, port, path, method, body, headers) {
        // http://stackoverflow.com/questions/6158933/how-to-make-an-http-post-request-in-node-js
		const options = {
			host,
			port,
			path,
			method,
			headers: Object.assign({}, headers, {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(JSON.stringify(body))
			})
		};

		return new Promise(function (resolve, reject) {
			const request = http.request(options, function (result) {
				result.setEncoding('utf8');
				result.on('data', function (chunk) {
					if (result.statusCode >= 400) {
						return reject(chunk);
					}
					resolve(JSON.parse(chunk));
				});
			});

			request.write(JSON.stringify(body));
			request.end();
		});
    }
}
