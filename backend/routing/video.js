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

  /**
   * @api {get} /api/videos/{id} Request video
   * @apiName GetVideo
   * @apiGroup Videos
   *
   * @apiParam {String} id                             Video id.
   *
   * @apiSuccess {Object}  video                       Video obj.
   * @apiSuccess {Object}  video.data                  Video data obj.
   * @apiSuccess {Object}  video.data.attributes       Video attributes obj.
   * @apiSuccess {String}  video.data.attributes.url   Video url.
   * @apiSuccess {String}  video.data.id               Video id.
   * @apiSuccess {String}  video.data.type             Video type.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *  {
   *    "data": {
   *      "type": "video",
   *      "id": "10",
   *      "attributes": {
   *        "url": "https://dl.boxcloud.com/d/1/A0nI9YwUM_Dfmt4WGLzSXS/download"
   *      }
   *    }
   *  }
   */
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
          reply(res.map(
            function(res) {

              // Remove extension from video
              res.name = res.name.replace(/\.([0-9a-z]+)(?:[\?#]|$)/, '');
              return {
                'type': 'video',
                'id': res.v_id,
                'attributes': res
              };
            }
          ));
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
            reply(res.map(
              function(res) {
                return {
                  'type': 'thumbnail',
                  'id': res.v_id,
                  'attributes': res.thumbnail
                };
              }
            ));
          },
          function(err) {
            reply(Boom.badImplementation(err));
          }
        );
      }
    }
  });
};
