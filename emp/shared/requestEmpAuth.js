(function () {
  'use strict';

  const makeRequest = require('../../common/request.js').makeRequest;
  const config = require('./getConfig.js');

  module.exports = function requestEmpAuthorization(host, employeeId, password) {
    const port  = config.emp.port;
    const path = '/auth';
    const method = 'post';
    const body = { employeeId, password };
    const headers = {
      'Host': host
    };
    return makeRequest(null, port, path, method, body, headers);
  };
})();
