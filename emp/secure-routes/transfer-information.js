(function () {
  'use strict';

  const makeRequest = require('../../common/request.js').makeRequest;
  const production = process.env.NODE_ENV === 'production';
  const config = production ?
      require('../../config/production.json')
    : require('../../config/local.json');

  module.exports = function createTransferInformationRoute(app) {
    app.get('/transfer-information', function (req, res) {
      res.render('transfer-information', {
        action: '/transfer-information',
        form: transferInformationForm,
        buttonText: 'Send information to MBR',
        signedInUser: req.signedInUser
      });
    });

    app.post('/transfer-information', function (req, res) {
      const endpoint = '/mbr/submit_employer_info';
      const { domain, port } = config.hostnames.mbr;
      const body = makeRequestBody(req);

      makeRequest(domain, port, endpoint, 'POST', body)
        .then(function () {
          res.render('transfer-information-result');
        })
        .catch(function (error) {
          res.render('transfer-information-result', { error });
        });

      function makeRequestBody(req) {
        const firstName = req.signedInUser.firstName;
        const lastName = req.signedInUser.lastName;

        const mortID = req.body.mortId;
        const name = [ firstName, lastName ].join(' ');
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
