var express = require('express');
var bodyParser = require('body-parser');
var bunyan = require('bunyan');
var path = require('path');

let config;

if (process.env.NODE_ENV === "local") {
	config = require('../config/local.json');
} else {
	config = require('../config/prod.json');
}

var app = express();
var log = bunyan.createLogger({
  name: 'Project Log',
  streams: [
    {
      level: 'info',
      path: 'log.log'
    }
  ],
});

app.use(bodyParser.json());

app.post("/logger/log", function(request, response) {
  let fields = ['service', 'endpoint', 'user_agent', 'request_body', 'response_code', 'response_body'];
  if (fields.every(function(x) { return x in request.body; })) {
		console.log('logging...');
    log.info(
      {
        'service': request.body.service,
        'endpoint': request.body.endpoint,
        'user-agent': request.body.user_agent,
        'request body' : request.body.request_body,
        'response code': request.body.response_code,
        'response body' : request.body.response_body
      }
    );
		response.sendStatus(200);
  } else {
		console.log('bad log request');
	  log.error({
      body: request.body
    }, 'Bad Request, missing required parameter.');
    response.status(400).send('Bad Request, missing required parameter.');
  }
});

app.listen(config.hostnames.log.port, function() {
  console.log('LOGGER listening on port ' + config.hostnames.log.port)
});
