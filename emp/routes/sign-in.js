(function () {
  'use strict';

  module.exports = function createSignInRoute(app) {
    app.get('/sign-in', function (req, res) {
      res.render('sign-in', {
        action: '/auth',
        form: signInForm,
        buttonText: 'Sign In'
      });
    });
  };

  const signInForm = [
    {
      type: 'text',
      name: 'username',
      label: 'Username',
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
