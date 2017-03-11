(function () {
  'use strict';

  const fs = require('fs');
  const path = require('path');
  const http = require('http');
  const https = require('https');
  const production = process.env.NODE_ENV === 'production';
  const config = production ? require('../config/production.json').hostnames
                            : require('../config/local.json').hostnames;

  module.exports = function startService(app, type) {
    const serviceRootDir = path.join(path.dirname(__dirname), type);
    const sslCredentials = getSslCredentials(serviceRootDir);
    const serviceName = type.toUpperCase();

    if (sslCredentials) {
      const securePort = parseInt(config[type].securePort);
      setupSecureRedirect(app);
      https.createServer(sslCredentials, app).listen(securePort, function () {
        console.log(`${ serviceName } listening on SSL port ${ securePort }`);
      });
    }

    const port = parseInt(config[type].port);
    http.createServer(app).listen(port, function () {
      console.log(`${ serviceName } listening on port ${ port }`);
    });
  };

  function getSslCredentials(rootDir) {
    const certDir = 'certs';
    const ca = path.join(rootDir, certDir, 'chain.pem');
    const key = path.join(rootDir, certDir, 'privkey.pem');
    const cert = path.join(rootDir, certDir, 'cert.pem');

    const credentials = {
      ca: readCredential(ca),
      cert: readCredential(cert),
      key: readCredential(key)
    };

    return credentials.ca && credentials.cert && credentials.key && credentials;

    function readCredential(path) {
      try {
        return fs.readFileSync(path).toString();
      } catch (e) {
        return undefined;
      }
    }
  }

  function setupSecureRedirect(app) {
    app.all('*', function redirectToSecureEndpoint(req, res, next) {
      if (!req.secure) {
        res.redirect('https://' + req.headers.host + req.url);
      }
      else {
        next();
      }
    });
  }
})();
