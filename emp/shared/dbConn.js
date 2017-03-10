(function () {
  'use strict';

  const Promise = require('bluebird');
  const MongoClient = require('mongodb').MongoClient;
  const mongoDbUrl = process.env.EMP_DB_URL;
  const dbConn = MongoClient.connect(mongoDbUrl, {
      promiseLibrary: Promise
    })
    .then(function (db) {
      console.log(`EMP connected to database`);
      return db.collection('employees');
    })
    .catch(function () {
      console.log(`EMP failed to connect to database`);
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
