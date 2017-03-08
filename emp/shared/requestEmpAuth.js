(function () {
  'use strict';

  const makeRequest = require('../../common/request.js').makeRequest;
  const production = process.env.NODE_ENV === 'production';
  const config = production ?
      require('../../config/production.json').hostnames.emp
    : require('../../config/local.json').hostnames.emp;

  module.exports = function requestEmpAuthorization(host, employeeId, password) {
    const port  = config.port;
    const path = '/auth';
    const method = 'post';
    const body = { employeeId, password };
    const headers = {
      'Host': host
    };
    return makeRequest(null, port, path, method, body, headers);
  };
})();
