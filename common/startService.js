(function () {
  'use strict';

  const http = require('http');
  const https = require('https');
  const config = require('../config/prod.json').hostnames;

  module.exports = function startService(app, type) {
    const serviceName = type.toUpperCase();
    const sslCredentials = app.get('sslCredentials');

    if (sslCredentials) {
      const securePort = parseInt(config[type].securePort);
      https.createServer(sslCredentials, app).listen(securePort, function () {
        console.log(`${ serviceName } listening on SSL port ${ securePort }`);
      });
    }

    const port = parseInt(config[type].port);
    http.createServer(app).listen(port, function () {
      console.log(`${ serviceName } listening on port ${ port }`);
    });
  };

})();
