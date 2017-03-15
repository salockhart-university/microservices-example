(function () {
  'use strict';

  const makeRequest = require('../../common/request.js').makeRequest;
  const requireAuth = require('../shared/requireAuth.js');
  const config = require('../shared/getConfig.js');

  module.exports = function createTransferInformationRoute(app) {
    app.get('/transfer-information', requireAuth, function (req, res, next) {
      res.render('transfer-information', {
        action: '/transfer-information',
        form: transferInformationForm,
        buttonText: 'Send information to MBR',
        signedInUser: req.signedInUser
      });
      next();
    });

    app.post('/transfer-information', requireAuth, function (req, res, next) {
      const endpoint = '/mbr/submit_employer_info';
      const { domain, port } = config.mbr;
      const body = makeRequestBody(req);

      makeRequest(domain, port, endpoint, 'POST', body, req.secure)
        .then(function () {
          res.render('transfer-information-result');
          next();
        })
        .catch(function (error) {
          res.render('transfer-information-result', { error });
          next();
        });

      function makeRequestBody(req) {
        const name = req.signedInUser.name;
        const mortID = req.body.mortId;
        const salary = req.signedInUser.salary;
        const employment_start = req.signedInUser.startDate;

        return { mortID, name, salary, employment_start };
      }
    });
  };

  const transferInformationForm = [
    {
      type: 'text',
      label: 'mortID',
      required: true,
      name: 'mortId'
    }
  ];
})();
