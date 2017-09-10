'use strict';

// External
const Hapi = require('hapi');
const _ = require('lodash');
const Promise = require('promise');
const connectDB = require('./dataConnection.js');
const fs = require('fs');

// Internal
const config = require('./config.js');
const migrations = require('./migrations/migrations');
const constants = require('./constants');

function logError(error) {
  console.log(' ======================= uncaughtException:');
  console.log(error.stack);
}

module.exports = function () {
  let promise = null;

  if (process.env.ENVIRONMENT === constants.ENVIRONMENTS.DEVELOPMENT) {
    promise = getTls();
  } else {
    promise = Promise.resolve();
  }

  promise.then(
    (tls) => {
      startServer(tls);
    },
    (err) => {
      console.log(err);
    }
  );
};

function startServer(tls) {
  const server = new Hapi.Server();

  if (process.env.PORT) {
    console.log('"PORT" env var detected: ' + process.env.PORT);
  }

  const serverConfig = {
    port: process.env.PORT || config.server.port,
    routes: {
      // TODO: Need to be investigated
      cors: {
        origin: ['*'],
        credentials: true
      }
    }
  };

  if (tls) {
    serverConfig.tls = tls;
  }

  server.connection(serverConfig);
  connectDB().then(
    _.bind(registerDAL, null)
  ).then(function(DAL) {
    return migrationsStart(DAL).then(
    _.bind(registerACL, null, server)
    ).then(
      _.bind(registerStaticFilesServer, null, server)
    ).then(
      _.bind(registerAuth, null, server, DAL)
    ).then(
      _.bind(registerRouting, null, server, DAL)
    ).then(
      _.bind(registerExternalLogging, null, server, config)
    ).then(
      _.bind(run, null, server)
    ).then(
      _.bind(showSuccessMessage, null, server)
    );
  }).catch(function (err) {
    logError(err);
  });
}

function getTls() {
  return new Promise(function (resolve, reject) {

    let tls = {
      key: null,
      cert: null,
      passphrase: null
    };
    fs.readFile('./cakey.pem', function (err, key) {
      if (err) {
        reject(err);
      } else {
        tls.key = key;
        fs.readFile('./cacert.pem', function (err, cert) {
          if (err) {
            reject(err);
          } else {
            tls.cert = cert;
            fs.readFile('./passphrase.txt', 'utf8', function (err, passphrase) {
              if (err) {
                reject(err);
              } else {
                tls.passphrase = passphrase;
                resolve(tls);
              }
            });
          }
        });
      }
    });

  });
}

function migrationsStart(DAL) {
  return new Promise(
    function (resolve) {
      console.log('-| Migrations start');
      migrations(DAL, function () {
        console.log('-| Migrations end');
        resolve();
      });
    }
  );
}

function registerStaticFilesServer(server) {
  return new Promise(
    function (resolve, reject) {
      const plugin = require('inert');
      server.register(plugin, function (err) {
        err ? reject() : resolve();
      });
    }
  );
}

function registerRouting(server, DAL) {
  const routing = require('./routing');
  routing.init(server, DAL);
}

function registerDAL(connection) {
  return require('./dal/dal.js')(connection);
}

function registerACL(server) {
  return new Promise(function (resolve, reject) {
    require('./acl.js')(server, function(err) {
      err ? reject() : resolve();
    });
  });
}

function showSuccessMessage(server) {
  server.log('info', 'Server running at: ' + server.info.uri);
  console.log('Server running at: ' + server.info.uri);
}

function run(server) {
  return new Promise(
    function (resolve, reject) {
      server.start((err) => {
        err ? reject(err) : resolve();
      });
    }
  );
}

function registerAuth(server, DAL) {
  const usersController = require('./controllers/users.js')(DAL);

  return new Promise(function (resolve, reject) {
    const AuthHeader = require('hapi-auth-header');

    server.register(AuthHeader, (err) => {
      if (err) {
        reject();
      } else {
        server.auth.strategy('simple', 'auth-header', {
          validateFunc: function (tokens, callback) {
            let tokenName = 'x-biz-token';

            usersController.getUserByToken(tokens[tokenName]).then(
              (user) => {
                return callback(null, true, user);
              },
              () => {
                return callback(null, false, null);
              }
            );
          }
        });
        resolve();
      }
    });
  });
}

function registerExternalLogging(server, config) {
  var Rollbar = require('rollbar');
  var rollbar = new Rollbar(config.logging.key);

  server.on('request-error', function(request, error) {
    // Note: before Hapi v8.0.0, this should be 'internalError' instead of 'request-error'
    if (error instanceof Error) {
      rollbar.error(error, request, cb);
    } else {
      rollbar.error('Error: ' + error, request, cb);
    }
  });

  function cb(rollbarErr) {
    if (rollbarErr) {
      console.error('Error reporting to rollbar, ignoring: ' + rollbarErr);
    }
  };
}
