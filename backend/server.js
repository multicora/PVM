'use strict';

// External
const Hapi = require('hapi');
const _ = require('lodash');
const Promise = require('promise');
const fs = require('fs');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');

// Internal
const Pack = require('../package');
const connectDB = require('./dataConnection.js');
const config = require('./config.js');
const migrations = require('./migrations/migrations');
const constants = require('./constants');

function logError(error) {
  const sqlConnectionError = 'ECONNREFUSED 127.0.0.1:3306';

  if (error.message.indexOf(sqlConnectionError) >= 0) {
    console.error('\n=================================');
    console.error('Could not connect to the database');
    console.error('=================================\n');
  }
  console.error(' ======================= uncaughtException:');
  console.error(error.stack);
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
    }
  ).catch(err => {
    console.error(err);
  });
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
      () => registerDocumentation(server)
    ).then(
      _.bind(run, null, server)
    ).then(
      _.bind(showSuccessMessage, null, server)
    ).then(() => registerRequestsInterseptor(server, DAL));
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
  if (process.env.ENVIRONMENT !== constants.ENVIRONMENTS.DEVELOPMENT) {
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
  }

  function cb(rollbarErr) {
    if (rollbarErr) {
      console.error('Error reporting to rollbar, ignoring: ' + rollbarErr);
    }
  };
}

function registerRequestsInterseptor(server, DAL) {
  return server.ext('onPreResponse', function (request, reply) {
    if (request.auth.credentials) {
      DAL.users.updateLastActivity(request.auth.credentials.id);
    }
    return reply.continue();
  });
}

function registerDocumentation(server) {
  const options = {
    info: {
      title: 'bizkonect API Documentation',
      version: Pack.version,
    }
  };

  return new Promise((resolve, reject) => {
    server.register(
      [
        Inert,
        Vision,
        {
          register: HapiSwagger,
          options: options
        }
      ],
      (err) => err ? reject(err) : resolve()
    );
  });

}
