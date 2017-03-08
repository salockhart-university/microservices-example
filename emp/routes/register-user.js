(function () {
  'use strict';

  module.exports = function createRegisterEmployeeRoute(app, dbConn) {
    app.post('/register-employee', function (req, res) {
      dbConn.registerEmployee(req.body).then(function (newUser) {
        console.log('hi');
      })
      .catch(function (err) {
        console.log('err');
      });
    });
  };
})();
