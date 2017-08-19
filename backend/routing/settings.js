'use strict';

const Boom = require('boom');

module.exports = function (server, DAL) {
  server.route({
    method: 'GET',
    path: '/api/ui-settings',
    handler: function (request, reply) {
      DAL.settings.getUiSettings().then(
        res => reply(res)
      ).catch(
        err => reply(Boom.badImplementation(err, err))
      );
    }
  });
};
