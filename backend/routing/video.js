'use strict';

const Boom = require('boom');

module.exports = function (server, DAL) {
  const storageCtrl = require('../controllers/storage.js')(DAL);
  /**
   * @api {post} /api/video Request for upload video
   *
   * @apiParam {Object}   file                 Video file.
   *
   * @apiName UploadVideo
   * @apiGroup Videos
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
    method: 'POST',
    path: '/api/video',
    config: {
      payload: {
        output: 'stream',
        parse: true,
        maxBytes: 2e+8, // 200Mb
        allow: 'multipart/form-data',
        timeout: false
      },
      auth: 'simple',
      handler: function (request, reply) {
        let user = request.auth.credentials;
        if (!request.payload.file) {
          reply( Boom.badRequest('Property "file" is absent') );
        } else {
          let name;
          if (request.payload.data && request.payload.data !== 'undefined') {
            name = request.payload.data;
          } else {
            name = request.payload.file.hapi.filename;
          }

          storageCtrl.addVideo(request.payload.file._data, name,
              user.id, user.firstName + user.secondName).then( () => {
            reply({'status': 'success'});
          }).catch( err => {
            console.error(err);
            reply(err);
          });
        }
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
        storageCtrl.getVideo(request.params.id).then(
          function (buffer) {
            reply({
              type: 'video',
              id: request.params.id,
              attributes: {
                url: buffer
              }
            });
          },
          function (err) {
            reply(Boom.badImplementation(500, err));
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
        let videoList = [];

        DAL.videos.getByAuthor(request.auth.credentials.id).then(function(res) {
          let promises = [];

          res.forEach( video => {
            video.name = video.name.replace(/\.([0-9a-z]+)(?:[\?#]|$)/, '');

            videoList.push({
              type: 'video',
              id: video.v_id,
              attributes: video
            });
            promises.push(storageCtrl.getVideo(video.v_id));
          });

          return Promise.all(promises);
        }).then( res => {

          for (let i = 0; i < videoList.length; i++) {
            videoList[i].attributes.url = res[i];
          }

          reply(videoList);
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
        reply([]);
      }
    }
  });

  /**
   * @api {post} /api/delete-video Request for delete video
   *
   * @apiParam {string}   id                 Video id.
   *
   * @apiName DeleteVideo
   * @apiGroup Videos
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
    method: 'POST',
    path: '/api/delete-video',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        DAL.videos.markAsDeleted(request.payload).then(() => {
          reply({'status': 'success'});
        }, err => {
          reply(Boom.badImplementation(err, err));
        });
      }
    }
  });
};
