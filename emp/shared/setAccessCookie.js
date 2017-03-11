(function () {
  'use strict';

  const production = process.env.NODE_ENV === 'production';
  const config = production ?
      require('../../config/production.json').hostnames.emp
    : require('../../config/local.json').hostnames.emp;

  module.exports = function setAccessCookie(token, res, secure) {
    res.cookie(config.accessTokenName, token, {
      httpOnly: true,
      expires: new Date(Date.now() + token.expiresIn * 1000), // Millis
      secure
    });
  };
})();
