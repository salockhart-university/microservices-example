(function () {
  'use strict';

  const config = require('./getConfig.js');

  module.exports = function setAccessCookie(token, res, secure) {
    res.cookie(config.emp.accessTokenName, token, {
      httpOnly: true,
      expires: new Date(Date.now() + token.expiresIn * 1000), // Millis
      secure
    });
  };
})();
