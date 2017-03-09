(function () {
  'use strict';

  const production = process.env.NODE_ENV === 'production';
  const config = production ? require('../config/production.json').hostnames.emp
                            : require('../config/local.json').hostnames.emp;

  const express = require('express');
  const path = require('path');
  const http = require('http');
  const dbConn = require('./shared/dbConn.js');
  const log = require('../common/common.js').logInfo;

  const app = express();

  setupMiddleware(app);
  setAppSecret(app);
  injectAuthoirzationTokenParser(app);
  setViewPath(app);
  loadRoutes(app, dbConn);

  http.createServer(app).listen(config.port);

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

  function injectAuthoirzationTokenParser(app) {
    const jwt = require('jsonwebtoken');

    app.use(function (req, res, next) {
      const token = req.cookies[config.accessTokenName];
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

    loadOpenRoutes();
    injectAuthBarrier(app);
    loadSecureRoutes();
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

    function loadOpenRoutes() {
      fs.readdirSync(routes)
          .map(file => path.join(routes, file)).forEach(loadRoute);
    }

    function injectAuthBarrier(app) {
      app.use(function (req, res, next) {
        if (req.signedInUser) {
          next();
        }
        else {
          res.redirect('/sign-in');
        }
      });
    }

    function loadSecureRoutes() {
      fs.readdirSync(secureRoutes)
          .map(file => path.join(secureRoutes, file)).forEach(loadRoute);
    }

    function configureLogger(app) {
      app.use(function (req, res, next) {
        log('emp', req.originalUrl, req, res.statusCode, res.body)
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
