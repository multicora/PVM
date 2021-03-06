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

  /**
   * @api {get} /api/notification-read/{id}  Request for mark notification as read
   *
   * @apiName MarkNotificationAsRead
   * @apiGroup Notifications
   *
   *
   * @apiSuccess {Object}   status           Status.
   * @apiSuccess {String}   status.status    Status.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success"
   *     }
   */
  server.route({
    method: 'GET',
    path: '/api/notification-read/{id}',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        DAL.notifications.markAsRead(request.params.id).then(() => {
          reply({'status': 'success'});
        }, err => {
          reply(Boom.badImplementation(err, err));
        });
      }
    }
  });

  /**
   * @api {get} /api/unread-message  Request for get unread message
   *
   * @apiName GetUnreadMessage
   * @apiGroup Notifications
   *
   *
   * @apiSuccess {Array}    status                    Status array.
   * @apiSuccess {Object}   status                    Status object.
   * @apiSuccess {String}   status.conversationId     conversation id.
   * @apiSuccess {String}   status.userId             user id.
   * @apiSuccess {String}   status.messageId          message id.
   * @apiSuccess {String}   status.notified           notified status.
   * @apiSuccess {String}   status.read               read status
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     [{
   *       "id": "1",
   *       "conversatinId": "1",
   *       "userId": "1",
   *       "messageId": "1",
   *       "notified": "1",
   *       "read": "0",
   *     }]
   */
  server.route({
    method: 'GET',
    path: '/api/unread-message',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        DAL.chat.getStatusByUser(request.auth.credentials.id).then(res => {
          reply(
            res.filter(status => {
              return status.read === 0;
            })
          );
        }, err => {
          reply(Boom.badImplementation(err, err));
        });
      }
    }
  });
};
