(function () {
  'use strict';

  module.exports = function (app) {
    app.get('/sign-up', function (req, res) {
      res.render('sign-up', {
        action: '/register-user',
        form: signUpForm,
        buttonText: 'Register'
      });
    });
  };

  const signUpForm = [
    {
      type: 'text',
      name: 'first_name',
      label: 'First Name',
      required: true
    },
    {
      type: 'text',
      name: 'last_name',
      label: 'Last Name',
      required: true
    },
    {
      type: 'number',
      min: 0,
      name: 'salary',
      label: 'Salary',
      required: true
    },
    {
      type: 'date',
      name: 'start_date',
      label: 'Start Date',
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
