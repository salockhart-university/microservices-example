(function () {
  'use strict'

  const Promise = require('bluebird');

  const production = process.env.NODE_ENV === 'production';
  const config = production ? require('../config/production.json').hostnames.emp
                            : require('../config/local.json').hostnames.emp;

  const MongoClient = require('mongodb').MongoClient;
  const url = 'blah';
  const connectToDb = Promise.promisify(MongoClient.connect)(url);

  module.exports = {

    registerUser: function (userObj) {
      return connectToDb.then(function () {
        // something
      })
      .catch(function (err) {
        // something
      });
    },

    fetchUser: function (employeeId, password) {
      return connectToDb.then(function () {
        // something
      })
      .catch(function () {
        // something
      });
    },

    fetchMortgageInfo: function (employeeId, password, mortId) {
      return connectToDb.then(function () {
        // something
      })
      .catch(function () {
        // something
      });
    }

  };
})();
