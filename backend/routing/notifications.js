'use strict';

const Boom = require('boom');

module.exports = function (server, DAL) {
  /**
   * @api {get} /api/notifications Request for user notifications
   *
   * @apiName GetNotifications
   * @apiGroup Notifications
   *
   *
   * @apiSuccess {Object[]}   notifications           List of notifications.
   * @apiSuccess {String}     notification.id         Notification id.
   * @apiSuccess {String}     notification.message    Notification message.
   * @apiSuccess {String}     notification.user       User id.
   * @apiSuccess {String}     notification.date       Notification date.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     [{
   *       id: 1,
   *       message: "message",
   *       user: 1,
   *       date: '0000-00-00 00:00:00'
   *     }]
   */
  server.route({
    method: 'GET',
    path: '/api/notifications',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        DAL.notifications.getByUser(request.auth.credentials.id).then(res => {
          reply(res);
        }, err => {
          reply(Boom.badImplementation(err, err));
        });
      }
    }
  });
};
