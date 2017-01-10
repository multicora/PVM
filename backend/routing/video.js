'use strict';

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

      handler: function (request, reply) {
        let name;
        if(request.payload.videoName) {
          name = request.payload.videoName;
        } else {
          name = request.payload.file.hapi.filename;
        }
        videoCtrl.saveFile(
          name,
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
    path: '/api/videos/{id}',
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
    path: '/api/videos',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
            console.log(11111);
        DAL.getAllvideos().then(
          function(res) {
            console.log(res);
            reply(
              {
                'data' : res.map(function(res) {
                  return {
                    'type': 'video',
                    'id': res.v_id,
                    'attributes': res
                  };
                })
              }
            );
          },
          function(err) {
            reply(Boom.badImplementation(err));
          }
        );
      }
    }
  });
  server.route({
    method: 'GET',
    path: '/api/thumbnails',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        videoCtrl.getAllThumbnails().then(
          function(res) {
            reply(
              {
                'data' : res.map(function(res) {
                  console.log(res);
                  // return {
                  //   'type': 'thumbnail',
                  //   'id': res.v_id,
                  //   'attributes': res
                  // };
                })
              }
            );
          },
          function(err) {
            reply(Boom.badImplementation(err));
          }
        );
      }
    }
  });
};