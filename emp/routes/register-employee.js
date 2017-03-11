(function () {
  'use strict';

  const requestEmpAuth = require('../shared/requestEmpAuth.js');
  const setAccessCookie = require('../shared/setAccessCookie.js');

  module.exports = function createRegisterEmployeeRoute(app, dbConn) {
    app.post('/register-employee', function (req, res) {
      const employeeInfo = req.body;
      const password = employeeInfo.password;
      
      dbConn.registerEmployee(employeeInfo)
        .then(function (employeeInfo) {
          requestEmpAuth(req.headers.host, employeeInfo.employeeId, password)
            .then(function (authRes) {
              setAccessCookie(authRes.token, res, req.secure);
              res.render('sign-up-success', { employeeInfo });
            });
        })
        .catch(function () {
          res.render('sign-up-fail');
        });
    });
  };
})();
