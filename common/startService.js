(function () {
  'use strict';

  const http = require('http');
  const https = require('https');
  const production = process.env.NODE_ENV === 'production';
  const config = production ? require('../config/production.json').hostnames
                            : require('../config/local.json').hostnames;

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
