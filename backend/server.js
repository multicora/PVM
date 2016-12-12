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

function logError(error) {
  console.log(' ======================= uncaughtException:');
  console.log(error.stack);
}

module.exports = function () {
  getTls().then(
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

  server.connection({
    port: config.server.port,
    tls: tls,
    routes: {
      // TODO: Need to be investigated
      cors: {
        origin: ['*'],
        credentials : true
      }
    }
  });
  connectDB().then(
    _.bind(registerDAL, null)
  ).then(
    function(DAL) {
      migrationsStart(DAL).then(
      _.bind(registerACL, null, server)
      ).then(
        _.bind(registerStaticFilesServer, null, server)
      // ).then(
      //   _.bind(registerAuth, null, server)
      ).then(
        _.bind(registerRouting, null, server, DAL)
      ).then(
        _.bind(run, null, server)
      ).then(
        _.bind(showSuccessMessage, null, server),
        function(err) {
          logError(err);
        }
      )
    },
    function (err) {
      logError(err);
    }
  )
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
        reject(err)
      } else {
        tls.key = key;
        fs.readFile('./cacert.pem', function (err, cert) {
          if (err) {
            reject(err)
          } else {
            tls.cert = cert;
            fs.readFile('./passphrase.txt', 'utf8', function (err, passphrase) {
              if (err) {
                reject(err)
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
    function (resolve, reject) {
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
        err ? reject() : resolve();
      });
    }
  );
}

// function registerAuth(server) {
//   return new Promise(function (resolve, reject) {
//     const AuthHeader = require('hapi-auth-header');

//     server.register(AuthHeader, (err) => {
//       if (err) {
//         reject();
//       } else {
//         server.auth.strategy('simple', 'auth-header', {
//           accessTokenName: 'X-CART-Token',
//           validateFunc: function (tokens, callback) {
//             var headerName = 'X-CART-Token';

//             DAL.users.getUserByToken(tokens[headerName], function (err, user) {
//               if (user) {
//                 callback(null, true, user);
//               } else {
//                 callback(null, false, null);
//               }
//             });
//           }
//         });
//         resolve();
//       }
//     });
//   });
// }