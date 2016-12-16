'use strict';

module.exports = function (server, DAL) {
  const videoCtrl = require('../controllers/video.js')(DAL);

  server.route({
    method: 'POST',
    path: '/video',
    config: {
      payload: {
        output: 'stream',
        parse: true,
        maxBytes: 2e+8, // 200Mb
        allow: 'multipart/form-data'
      },

      handler: function (request, reply) {
        videoCtrl.saveFile(
          request.payload.file.hapi.filename,
          request.payload.file._data
        ).then(
          function () {
            reply();
          },
          function (err) {
            console.log('Error:')
            console.log(new Error(err))
            reply(Boom.badImplementation(500, err));
          }
        );
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/videos/{id}',
    config: {
      handler: function (request, reply) {
        videoCtrl.getFile(request.params.id).then(
          function (buffer) {
            reply({
              data: {
                "type": "video",
                id: 7,
                attributes: {
                  url:buffer.uri.href
                }
              }
            });
          },
          function (err) {
            console.log(err);
            reply(500, 'Internal error');
          }
        );
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/videos',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        DAL.videos.getAllVideos().then(function(res) {
          reply({'data' : res.map(
            function(res) {
              return {
                'type': 'video',
                'id': res.v_id,
                'attributes': res
              };
            }
          )});
        }, function(err) {
          reply(Boom.badImplementation(500, err));
        });
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/conversation',
    handler: function (request, reply) {
      const message = [
        'Link: ' + request.payload.link,
        // 'Message: ',
        // request.payload.complaintMessage
      ].join('\n');
      const mail = {
        from: '"No-reply" <no.reply.bizkonect.project@gmail.com>', // sender address
        to: 'no.reply.bizkonect.project@gmail.com', // list of receivers
        subject: 'Complaint from ' + request.payload.name, // Subject line
        text: message, // plaintext body
        html: '<div style="white-space: pre;">' + message + '</div>' // html body
      };

      Mailer(config.mail).send(mail).then(
        (res) => {
          reply(res);
        }, (err) => {
          reply( Boom.badImplementation(err.message, err) );
        }
      );
    }
  });
};