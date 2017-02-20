'use strict';

const Boom = require('boom');

module.exports = function (server, DAL) {
  server.route({
    method: 'GET',
    path: '/api/roles',
    handler: function (request, reply) {
      let roles;
      let rolesToActions;
      let actions;
      let result;

      DAL.roles.getRoles().then(
        function(res) {
          roles = res;
          return DAL.roles.getRolesToActions();
        })
      .then(function(res) {
        rolesToActions = res;
        return DAL.actions.getActions();
      })
      .then(function(res) {
        try {
          actions = res;

          roles.map(function(role) {
            role.actions = [];
            rolesToActions.forEach(function(roleToAction) {
              if (role.id == roleToAction.id_role) {
                role.actions.push(roleToAction.id_action);
              }
            });
          });

          roles.map(function(role) {
            actions.map(function(action) {
              for (var i = 0; i < role.actions.length; i++) {
                if (role.actions[i] === action.id) {
                  role.actions[i] = action;
                }
              }
            });
          });

          reply(roles);

        } catch (err) {
          reply(JSON.stringify(Boom.badImplementation(err)));
        }
      });
    }
  });
};