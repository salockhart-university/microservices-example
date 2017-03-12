'use strict';

const request = require('./request');

let config;
if (process.env.NODE_ENV === "local") {
	config = require('../config/local.json');
} else {
	config = require('../config/prod.json');
}

module.exports = {
	logInfo: function(service, endpoint, req, response_code, response_body) {
		const body = {
			service,
			endpoint,
			request_body: req.body,
			user_agent: req.headers['user-agent'],
			response_code,
			response_body
		}

        const {
            domain,
            port
        } = config.hostnames.log;

        return request.makeRequest(domain, port, '/logger/log', 'POST', body);
	}
};
