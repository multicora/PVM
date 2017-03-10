'use strict';

const Boom = require('boom');

module.exports = function (server, DAL) {
  const videoCtrl = require('../controllers/video.js')(DAL);

  server.route({
    method: 'POST',
    path: '/api/video',
    config: {
      payload: {
        output: 'stream',
        parse: true,
        maxBytes: 2e+8, // 200Mb
        allow: 'multipart/form-data'
      },
      auth: 'simple',

      handler: function (request, reply) {
        let user = request.auth.credentials;
        let name;
        if (request.payload.data) {
          name = request.payload.data;
        } else {
          name = request.payload.file.hapi.filename;
        }
        videoCtrl.saveFile(
          name,
          user.id,
          request.payload.file._data
        ).then(
          function () {
            reply();
          },
          function (err) {
            console.log('Error:');
            console.log(new Error(err));
            reply(Boom.badImplementation(500, err));
          }
        );
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/videos/{id}',
    config: {
      handler: function (request, reply) {
        videoCtrl.getFile(request.params.id).then(
          function (buffer) {
            reply({
              type: 'video',
              id: 7,
              attributes: {
                url: buffer.uri.href
              }
            });
          },
          function (err) {
            console.log('Error:');
            console.log(new Error(err));
            reply(500, 'Internal error');
          }
        );
      }
    }
  });

server.route({
    method: 'GET',
    path: '/api/videos',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        DAL.videos.getByAuthor(request.auth.credentials.id).then(function(res) {
          reply({'data': res.map(
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
    method: 'GET',
    path: '/api/thumbnails',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        videoCtrl.getThumbnails(request.auth.credentials.id).then(
          function(res) {
            reply({'data': res.map(
              function(res) {
                return {
                  'type': 'thumbnail',
                  'id': res.v_id,
                  'attributes': res.thumbnail
                };
              }
            )});
          },
          function(err) {
            reply(Boom.badImplementation(err));
          }
        );
      }
    }
  });
};
