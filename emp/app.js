(function () {
  'use strict';

  const production = process.env.NODE_ENV === 'production'
  const config = production ? require('../config/production.json').hostnames.emp
                            : require('../config/local.json').hostnames.emp;

  const express = require('express');
  const path = require('path');
  const http = require('http');
  const dbConn = require('./dbConn.js');

  const app = express();

  setupMiddleware(app);
  setAppSecret(app);
  injectAuthoirzationTokenParser(app);
  setViewPath(app);

  http.createServer(app).listen(config.port);

  function setupMiddleware(app) {
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');

    app.use(bodyParser.json());
    app.use(bodyParser.urlEncoded({ extended: true }));
    app.use(cookieParser());
  }

  function setAppSecret(app) {
    const uuid = require('uuid/v4');
    const appSecret = uuid();

    app.set('secret', appSecret);
  }

  function injectAuthoirzationTokenParser(app) {
    const jwt = require('jsonwebtoken');

    app.use(function (req, res, next) {
      const tokenName = 'csci4145_emp_access_token';
      const token = req.cookies[tokenName];
      if (token) {
        jwt.verify(token, app.get('secret'), function (err, decoded) {
          if (!err) {
            req.signedInUser = decoded;
          }
          next();
        });
      }
      else {
        next();
      }
    });
  }

  function setViewPath(app) {
    const viewPath = path.join(__dirname, 'views');

    app.set('view engine', 'ejs');
    app.set('views', viewPath);
  }

})();
