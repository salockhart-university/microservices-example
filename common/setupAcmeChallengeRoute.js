(function () {
  'use strict';

  const path = require('path');
  const fs = require('fs');

  module.exports = function setupAcmeChallengeRoute(app) {
    const wellKnownAcmeDir = '/.well-known/acme-challenge/';
    const acmeChallengeEndpoint = path.join(wellKnownAcmeDir, ':hash');

    app.get(acmeChallengeEndpoint, function (req, res) {
      const challengePath = path.join(wellKnownAcmeDir, req.params.hash);
      fs.readFile(challengePath, function (err, data) {
        if (err || !data) {
          res.sendStatus(500);
          return;
        }
        res.send(data.toString());
      });
    });
  };
})();
