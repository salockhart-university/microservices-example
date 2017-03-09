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
    setupAcmeChallengeRoute(app);

    const sslCredentials = getSslCredentials();
    if (sslCredentials) {
      const securePort = parseInt(config[type].securePort);
      https.createServer(sslCredentials, app).listen(securePort);

    }
    const port = parseInt(config[type].port);
    http.createServer(app).listen(port);
  };

  function setupAcmeChallengeRoute(app) {
    const wellknownAcmeDir = '/.well-known/acme-challenge/';
    const acmeChallengeEndpoint = path.join(wellknownAcmeDir, ':hash');

    app.get(acmeChallengeEndpoint, function (req, res) {
      const challengePath = path.join(wellknownAcmeDir, req.params.hash);
      fs.readFile(challengePath, function (err, data) {
        if (err || !data) {
          res.sendStatus(500);
          return;
        }
        res.send(data.toString());
      });
    });
  }

  function getSslCredentials() {
    const certPath = 'certs';
    const ca = path.join(__dirname, certPath, 'chain.pem');
    const key = path.join(__dirname, certPath, 'privkey.pem');
    const cert = path.join(__dirname, certPath, 'cert.pem');

    const credentials = {
      ca: readCredential(ca),
      cert: readCredential(cert),
      key: readCredential(key)
    };

    return credentials.ca
        && credentials.cert
        && credentials.key
        && credentials;

    function readCredential(path) {
      try {
        return fs.readFileSync(path).toString();
      } catch (e) {
        return undefined;
      }
    }
  }

  function setupSecureRedirect(app) {
    app.all('*', function (req, res, next) {
      if (!req.secure) {
        res.redirect('https://' + req.headers.host + req.url);
      }
      else {
        next();
      }
    });
  }
})();
