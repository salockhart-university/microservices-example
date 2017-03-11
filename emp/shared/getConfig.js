(function () {
  'use strict';

  const production = process.env.NODE_ENV === 'production';
  const config = production ? require('../../config/prod.json').hostnames
                              : require('../../config/local.json').hostnames;

  module.exports = config;

})();
