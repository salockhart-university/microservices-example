(function () {
  'use strict';

  const production = process.env.NODE_ENV === 'production';
  const config = production ? require('../config/production.json').hostnames.emp
                            : require('../config/local.json').hostnames.emp;

  const express = require('express');
  const path = require('path');
  const http = require('http');
  // const dbConn = require('./dbConn.js');
  const dbConn = {};

  const app = express();

  setupMiddleware(app);
  setAppSecret(app);
  injectAuthoirzationTokenParser(app);
  setViewPath(app);
  loadRoutes(app, dbConn);

  http.createServer(app).listen(config.port);

  function setupMiddleware(app) {
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
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
      const tokenName = 'CSCI4145_EMP_ACCESS_TOKEN';
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

  function loadRoutes(app, dbConn) {
    const fs = require('fs');
    const routes = path.join(__dirname, 'routes');
    const secureRoutes = path.join(__dirname, 'secure-routes');

    fs.readdirSync(routes)
      .map(file => path.join(routes, file))
      .forEach(loadRoute);

    injectAuthorizationBarrier(app);

    fs.readdirSync(secureRoutes)
      .map(file => path.join(secureRoutes, file))
      .forEach(loadRoute);

    function loadRoute(path) {
      let ext = path.extname(path);
      if (ext === '.js') {
        const routeInit = require(path);
        if (typeof routeInit === 'function') {
          routeInit(app, dbConn);
        }
        else {
          console.log(`Error loading route '${path}`);
          process.exit(1);
        }
      }
    }

    function injectAuthorizationBarrier(app) {
      app.use(function (req, res, next) {
        if (req.signedInUser) {
          next();
        }
        else {
          res.render('access-denied');
        }
      });
    }
  }
})();
