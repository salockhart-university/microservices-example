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
<<<<<<< HEAD
    return makeRequest(null, port, path, method, body, headers, secure);
=======
    return makeRequest(host, port, path, method, body, headers);
>>>>>>> 3c64b94b6b4e18d3d33880b5a4209cd5647563ac
  };
})();
