(function () {
  'use strict';

  module.exports = function createHomeRoute(app, dbConn) {
    app.get('/transfer-information', function (req, res) {
      res.render('transfer-information', {
        action: '/transfer-information',
        form: transferInformationForm,
        buttonText: 'Send information to MBR',
        signedInUser: req.signedInUser
      });
    });

    app.post('/transfer-information', function (req, res) {
      // Temporary thing until I figure out how to contact EMP
      res.render('transfer-information', {
        action: '/transfer-information',
        form: transferInformationForm,
        buttonText: 'Send information to MBR',
        signedInUser: req.signedInUser
      });
    });
  };

  const transferInformationForm = [
    {
      type: 'text',
      label: 'mortID',
      required: true,
      name: 'mortId'
    },
  ];
})();
