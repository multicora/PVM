'use strict';

const Boom = require('boom');

module.exports = function (server, DAL) {
  /**
   * @api {get} /api/roles Request Roles list
   * @apiName GetRoles
   * @apiGroup Roles
   *
   * @apiSuccess {Object[]} roles               List of roles.
   * @apiSuccess {String}   roles.id            Role id.
   * @apiSuccess {String}   roles.name          Role name.
   * @apiSuccess {Object[]}   roles.actions     Role actions.
   * @apiSuccess {String}   roles.actions.id    Role actions id.
   * @apiSuccess {String}   roles.actions.name  Role actions name.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     [{
   *       "id": 1,
   *       "name": "admin",
   *       "actions": [{
   *         "id": 1,
   *         "name": "CAN_SEE_USERS_PAGE"
   *       }]
   *     }]
   */
  server.route({
    method: 'GET',
    path: '/api/roles',
    handler: function (request, reply) {
      let roles;
      let rolesToActions;
      let actions;

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
              if (role.id === roleToAction.id_role) {
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
