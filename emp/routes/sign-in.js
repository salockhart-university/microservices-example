(function () {
  'use strict';

  const makeRequest = require('../../common/request.js').makeRequest;
  const production = process.env.NODE_ENV === 'production';
  const config = production ?
      require('../../config/production.json').hostnames.emp
    : require('../../config/local.json').hostnames.emp;

  module.exports = function createSignInRoute(app) {
    app.get('/sign-in', function (req, res) {
      res.render('sign-in', {
        action: '/sign-in',
        form: signInForm,
        buttonText: 'Sign In'
      });
    });

    app.post('/sign-in', function (req, res) {
      const host = req.headers.host;
      const secure = req.secure;
      const { employeeId, password } = req.body;

      requestEmpAuthorization(host, employeeId, password)
        .then(function (authRes) {
          if (authRes.success) {
            setAccessCookie(authRes, res, secure);
            res.render('home', { username: req.body.username });
          }
          else {
            res.render('sign-in');
          }
      });
    });
  };

  const signInForm = [
    {
      type: 'text',
      name: 'employee_id',
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

  function requestEmpAuthorization(host, employeeId, password) {
    const port  = config.port;
    const path = '/auth';
    const method = 'post';
    const body = { employeeId, password };
    const headers = {
      'Host': host
    };
    return makeRequest(null, port, path, method, body, headers);
  }

  function setAccessCookie(token, res, secure) {
    res.cookie(config.accessTokenName, token, {
      httpOnly: true,
      expires: new Date(Date.now() + token.expiresIn * 1000), // Millis
      secure
    });
  }
})();
