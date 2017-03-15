(function () {
  'use strict';

  module.exports = function createAuthRoute(app, dbConn) {
    app.post('/auth', function (req, res, next) {
      const { employeeId, password } = req.body;

      dbConn.fetchEmployee(employeeId)
        .bind({})
        .then(function (userObj) {
          this.userObj = userObj;
          const bcrypt = require('bcrypt');
          const passwordHash = userObj.passwordHash;
          return bcrypt.compare(password, passwordHash);
        })
        .then(function (correct) {
          if (correct) {
            const expiresIn = 10 * 60; // Seconds
            const jwt = require('jsonwebtoken');
            const token = jwt.sign(this.userObj, app.get('secret'), {
              expiresIn
            });
            res.json({ success: true, token, expiresIn });
          }
          else {
            return Promise.reject();
          }
        })
        .catch(function () {
           res.json({ success: false });
        })
        .finally(function () {
          next();
        });
    });
  };
})();
