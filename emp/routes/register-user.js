(function () {
  'use strict';

  module.exports = function createRegisterUserRoute(app, dbConn) {
    app.post('/register-user', function (req, res, next) {
      console.log(req.body);
      res.redirect('/home');

      // dbConn.registerUser(req.body).then(function () {
      //   // probably login on success, then redirect to home
      // })
      // .catch(function () {
      //   // redirect to some error page
      // });
    });
  };
})();
