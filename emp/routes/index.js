(function () {
  'use strict';

  module.exports = function createIndexRoute(app) {
    app.get('/', function (req, res) {
      const redirect = req.signedInUser ? '/sign-in' : '/transfer-information';
      res.redirect(redirect);
    });
  };
})();
