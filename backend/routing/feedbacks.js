'use strict';

const Boom = require('boom');
// const templates = require('../services/templates.js')();
const config = require('../config.js');
const mailer = require('../services/mailer.js');

module.exports = function (server, DAL) {
  /**
   * @api {post} /api/feedback Request for send feedback
   *
   * @apiParam {Object}   feedback               feedback object.
   * @apiParam {String}   feedback.email               feedback email.
   * @apiParam {String}   feedback.message               feedback message.
   *
   * @apiName SendFeedback
   * @apiGroup Feedbacks
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
    path: '/api/feedback',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        let feedback = request.payload;

        DAL.feedbacks.add(feedback).then(() => {
        }).then( template => {
            const mail = {
              to: config.suport.email,
              subject: 'Feedback',
              text: template.text,
              html: template.html
            };

            mailer(config).send(mail).then(
              () => {
                reply({'status': 'success'});
              }, (err) => {
                reply(Boom.badImplementation(err.message, err));
              }
            );
        }, err => {
          reply(Boom.badImplementation(err.message, err));
        });
      }
    }
  });
};
