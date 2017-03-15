(function () {
  'use strict';

  module.exports = function createRegisterEmployeeRoute(app, dbConn) {
    app.post('/register-employee', function (req, res, next) {
      const employeeInfo = req.body;

      dbConn.registerEmployee(employeeInfo)
        .then(function (employeeInfo) {
          res.render('sign-up-success', { employeeInfo });
        })
        .catch(function () {
          res.render('sign-up-fail');
        })
        .finally(function () {
          next();
        });
    });
  };
})();
