(function () {
  'use strict';

  module.exports = function (req, res, next) {
    if (req.signedInUser) {
      next();
    }
    else {
      res.redirect('/sign-in');
    }
  };
})();
