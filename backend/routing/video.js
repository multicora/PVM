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
            reply(Boom.wrap(err, 500));
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

};