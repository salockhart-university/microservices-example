(function () {
  'use strict';

  module.exports = function (app) {
    app.get('/sign-up', function (req, res) {
      res.render('sign-up', {
        action: '/register-employee',
        form: signUpForm,
        buttonText: 'Register'
      });
    });
  };

  const signUpForm = [
    {
      type: 'text',
      name: 'firstName',
      label: 'First Name',
      required: true
    },
    {
      type: 'text',
      name: 'lastName',
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
      name: 'startDate',
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
