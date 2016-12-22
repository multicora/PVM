'use strict';

module.exports = function (server, DAL) {
  const videoCtrl = require('../controllers/video.js')(DAL);
  const notifyCtrl = require('../controllers/notification.js')(DAL);

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

        notifyCtrl.checkAsViewed(request.params.id, request.headers.authorization);

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
            console.log('Error:')
            console.log(new Error(err))
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
};