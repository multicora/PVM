'use strict';

const Boom = require('boom');

module.exports = function (server, DAL) {
  const dashboardController = require('../controllers/dashboard.js')(DAL);
  server.route({
    method: 'GET',
    path: '/api/dashboard',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        dashboardController.get().then(
          res => reply(res)
        ).catch(
          err => reply(Boom.badImplementation(err, err))
        );
      }
    }
  });
};

