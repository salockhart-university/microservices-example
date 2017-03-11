(function () {
  'use strict';

  const production = process.env.NODE_ENV === 'production';
  module.exports = production ? require('../../config/prod.json').hostnames.emp
                              : require('../../config/local.json').hostnames.emp;

})();
