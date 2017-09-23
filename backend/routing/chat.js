'use strict';

const Boom = require('boom');
const Joi = require('joi');

const utils = require('../utils.js');

module.exports = function (server, DAL) {
  const chatCtrl = require('../controllers/chat.js')(DAL);

  server.route({
    method: 'get',
    path: '/api/v2/chat/{id}',
    config: {
      description: 'Returns messages for conversation',
      notes: 'Returns messages for conversation',
      tags: ['api', 'chat'],
      validate: {
        params: {
          id: Joi.string().required(),
        }
      },
      response: {
        schema: Joi.array().items(
          Joi.object({
            authorId: Joi.number().label('Author ID'),
            date: Joi.date().label('Date'),
            message: Joi.string().label('Message'),
          })
        ).label('Message list')
      },
      auth: 'simple',
      handler: function (request, reply) {
        const conversationId = request.params.id;

        DAL.chat.getByConversationId(conversationId).then(res => {
          return res.map(item => ({
            authorId: item.authorId,
            date: item.date,
            message: item.message,
          }));
        }).then(res => {
          reply(res);
        }).catch( err => {
          reply(Boom.badImplementation(err, err));
        });
      }
    }
  });

  server.route({
    method: 'post',
    path: '/api/v2/chat/{id}',
    config: {
      description: 'Send messages in the conversation',
      notes: 'Send messages in the conversation',
      tags: ['api', 'chat'],
      validate: {
        params: {
          id: Joi.string().required(),
        },
        payload: {
          message: Joi.string().label('Message'),
          authorId: Joi.number().label('Author ID'),
        }
      },
      auth: 'simple',
      handler: function (request, reply) {
        const conversationId = request.params.id;
        const message = request.payload.message;
        const authorId = request.payload.authorId;
        const serverUrl = utils.getServerUrl(request);
        const url = `${serverUrl}/conversation/${conversationId}`;

        // TODO: check if author exists
        // TODO: check if conversation exists

        chatCtrl.incomeMessage({
          message: message,
          authorId: authorId,
          conversationId: conversationId,
          url: url,
        });

        reply();
      }
    }
  });

  server.route({
    method: 'post',
    path: '/api/v2/chat/read',
    config: {
      description: 'Mark conversation as read',
      notes: 'Mark conversation as read',
      tags: ['api', 'chat'],
      validate: {
        payload: {
          userId: Joi.number().label('Author ID'),
          conversationId: Joi.number().label('Author ID'),
        }
      },
      auth: 'simple',
      handler: function (request, reply) {
        const userId = request.payload.authorId;
        const conversationId = request.payload.conversationId;

        // TODO: check if user exists
        // TODO: check if conversation exists

        chatCtrl.clearTimer(conversationId, userId);

        reply();
      }
    }
  });
};
