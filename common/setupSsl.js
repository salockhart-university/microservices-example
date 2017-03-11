(function () {
  'use strict';

  const fs = require('fs');
  const path = require('path');

  module.exports = function setupSsl(app, type) {
    const serviceRootDir = path.join(path.dirname(__dirname), type);
    const sslCredentials = getSslCredentials(serviceRootDir);
    if (sslCredentials) {
      setupSecureRedirect(app);
      app.set('sslCredentials', sslCredentials);
    }
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
