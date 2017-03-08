(function () {
  'use strict';

  module.exports = function createIndexRoute(app) {
    app.get('/', function (req, res) {
      const redirect = req.signedInUser ? '/home' : '/sign-in';
      res.redirect(redirect);
    });
  };
})();
