(function () {
  'use strict';

  const requestEmpAuth = require('../shared/requestEmpAuth.js');
  const setAccessCookie = require('../shared/setAccessCookie.js');

  module.exports = function createSignInRoute(app) {
    const signInLocals = {
      action: '/sign-in',
      form: signInForm,
      buttonText: 'Sign In',
      errorMessage: null
    };

    app.get('/sign-in', function (req, res) {
      res.render('sign-in', signInLocals);
    });

    app.post('/sign-in', function (req, res) {
      const host = req.headers.host;
      const secure = req.secure;
      const { employeeId, password } = req.body;

      requestEmpAuth(host, employeeId, password, req.secure)
        .then(function (authRes) {
          if (authRes.success) {
            setAccessCookie(authRes.token, res, secure);
            res.redirect('/transfer-information');
          }
          else {
            res.render('sign-in', signInLocals);
          }
      });
    });
  };

  const signInForm = [
    {
      type: 'text',
      name: 'employeeId',
      label: 'Employee ID',
      required: true
    },
    {
      type: 'password',
      name: 'password',
      label: 'Password',
      required: true
    }
  ];

})();
