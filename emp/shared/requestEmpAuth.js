(function () {
  'use strict';

  const makeRequest = require('../../common/request.js').makeRequest;
  const config = require('./getConfig.js');

  module.exports = function requestEmpAuthorization(host, employeeId, password, secure) {
    const port  = config.emp.port;
    const path = '/auth';
    const method = 'post';
    const body = { employeeId, password };
    const headers = {
      'Host': host
    };
    host = process.env.NODE_ENV === 'local' ? null : host;
    return makeRequest(host, port, path, method, body, headers, secure);
  };
})();
