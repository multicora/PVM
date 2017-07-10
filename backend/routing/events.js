'use strict';

const Boom = require('boom');

module.exports = function (server, DAL) {
  /**
   * @api {post} /api/events Request getting events
   *
   * @apiParam {array}   ConversationsId                 Conversations Id.
   * @apiParam {string}     Conversation Id                 Conversation Id.
   *
   * @apiName GetEvents
   * @apiGroup Events
   *
   *
   * @apiSuccess {Object[]}   events           Events.
   * @apiSuccess {String}   status.status    Status.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     [{
   *       "id": 1,
   *       "userId": "1",
   *       "conversationId": "1",
   *       "date": "0000-00-00 00:00:00",
   *       "metadata": "JSON"
   *     }]
   */
  server.route({
    method: 'POST',
    path: '/api/events',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        let promises = [];

        request.payload.forEach( conversationId => {
          promises.push(DAL.events.getByConversationId(conversationId));
        });

        Promise.all(promises).then( res => {
          let result = [];

          res.filter(arr => {
            return arr.length >= 1;
          });

          res.forEach(arr => {
            arr.forEach(event => {
              event.metadata = JSON.parse(event.metadata);
              result.push(event);
            });
          });

          reply(result);
        }).catch( err => {
          reply(Boom.badImplementation(500, err));
        });
      }
    }
  });
};
