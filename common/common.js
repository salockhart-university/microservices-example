module.exports = {

  var http = require('http');

  let config;

  if (process.env.NODE_ENV === "local") {
    config = require('../config/local.json');
  } else {
    config = require('../config/prod.json');
  }

  logInfo: function(service, endpoint, request, response_status, response_body) {
    var body = {
      service: service,
      endpoint: endpoint,
      request_body: request.body,
      user_agent: request.headers['user-agent']
      response_status: response_status,
      response_body: response_body
    }

    var options = {
      host: config.hostnames.log.domain,
      port: config.hostnames.log.port,
      path: '/logger/log',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
  			'Content-Length': Buffer.byteLength(JSON.stringify(body))
      }
    }

    var request = http.request(options, function(result) {
      //do things
    });

    request.write(JSON.stringify(body));
    request.end();
  }
};
