'use strict';

// External
const Hapi = require('hapi');
const _ = require('lodash');
const Promise = require('promise');
const connectDB = require('./dataConnection.js');
// Internal
const config = require('./config.js')

function logError(error) {
  console.log(' ======================= uncaughtException:');
  console.log(error.stack);
}

module.exports = function () {
  startServer();

  function startServer() {
    const server = new Hapi.Server();
    server.connection({
      port: config.server.port,
      routes: {
        // TODO: Need to be investigated
        cors: {
          origin: ['*'],
          credentials : true
        }
      }
    });
    registerACL(server).then(
      registerStaticFilesServer(server)
    ).then(
      _.bind(registerRouting, null, server)
    // ).then(
    //   _.bind(registerAuth, null, server)
    ).then(
      connectDB
    ).then(
      _.bind(run, null, server)
    ).then(
      _.bind(showSuccessMessage, null, server),
      function (err) {
        logError(err);
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

  function registerRouting(server) {
    const routing = require('./routing');
    routing.init(server);
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
};