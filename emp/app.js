(function () {
  'use strict';

  const config = require('./shared/getConfig.js');

  const express = require('express');
  const path = require('path');
  const dbConn = require('./shared/dbConn.js');
  const log = require('../common/common.js').logInfo;
  const setupSsl = require('../common/setupSsl.js');
  const startService = require('../common/startService.js');
  const setupAcmeChallengeRoute
          = require('../common/setupAcmeChallengeRoute.js');

  const app = express();

  setupMiddleware(app);
  setAppSecret(app);
  setupSsl(app, 'emp');
  injectAuthTokenParser(app);
  setViewPath(app);
  loadRoutes(app, dbConn);

  startService(app, 'emp');

  /* Utility methods */

  function setupMiddleware(app) {
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');
    const staticDir = 'public';

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(express.static(staticDir));
  }

  function setAppSecret(app) {
    const uuid = require('uuid/v4');
    const appSecret = uuid();

    app.set('secret', appSecret);
  }

  function injectAuthTokenParser(app) {
    const jwt = require('jsonwebtoken');

    app.use(function (req, res, next) {
      const token = req.cookies[config.emp.accessTokenName];
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

    setupAcmeChallengeRoute(app);
    loadRoutes();
    configureLogger(app);

    function loadRoute(route) {
      let ext = path.extname(route);
      if (ext === '.js') {
        const routeInit = require(route);
        if (typeof routeInit === 'function') {
          routeInit(app, dbConn);
        }
        else {
          console.log(`Error loading route '${route}'`);
          process.exit(1);
        }
      }
    }

    function loadRoutes() {
      fs.readdirSync(routes)
          .map(file => path.join(routes, file)).forEach(loadRoute);
    }

    function configureLogger(app) {
      app.use(function (req, res, next) {
        console.log(req.originalUrl);
        console.log(res.statusCode);
        console.log(res.body);
        log('emp', req.originalUrl, req, res.statusCode, res.body || {})
          .then(() => next())
          .catch(function (err) {
            console.log(`Warning: failed to log request from ${ req.url }`);
            console.log(err);
            next();
          });
      });
    }
  }
})();
