(function () {
  'use strict';

  const production = process.env.NODE_ENV === 'production';
  const config = production ?
        require('../../config/production.json').hostnames.emp
      : require('../../config/local.json').hostnames.emp;

  const Promise = require('bluebird');
  const MongoClient = require('mongodb').MongoClient;
  const mongoDbUrl = config.mongoDbUrl;
  const dbConn = MongoClient.connect(mongoDbUrl, {
      promiseLibrary: Promise
    })
    .then(function (db) {
      console.log(`Connected to MongoDB backend at ${ mongoDbUrl }`);
      return db.collection('employees');
    })
    .catch(function () {
      console.log(`Failed to connect to MongoDB backend at ${ mongoDbUrl }`);
      console.log('Exiting...');
      process.exit(1);
    });

  module.exports = {
    registerEmployee: function (userObj) {
      return dbConn.then(function (employeeCollection) {
        const uuid = require('uuid/v4');
        const bcrypt = require('bcrypt');
        const saltRounds = 8;

        userObj.employeeId = uuid();

        return bcrypt.hash(userObj.password, saltRounds)
          .then(function (passwordHash) {
            userObj.passwordHash = passwordHash;
            delete userObj.password;
            return employeeCollection.insertOne(userObj);
          })
          .then(function (result) {
            return result.ops[0];
          });
      });
    },
    fetchEmployee: function (employeeId) {
      return dbConn.then(function (employeeCollection) {
        return employeeCollection.findOne({ employeeId });
      });
    }
  };
})();
