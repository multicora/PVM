'use strict';

const Boom = require('boom');

module.exports = function (server, DAL) {
  const storageCtrl = require('../controllers/storage.js')(DAL);
  /**
   * @api {post} /api/file Request for upload file
   *
   * @apiParam {Object}   file                 File.
   *
   * @apiName UploadFile
   * @apiGroup Files
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
    path: '/api/file',
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

          storageCtrl.addFile(request.payload.file._data, name,
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
   * @api {get} /api/file/{id} Request file
   * @apiName GetFile
   * @apiGroup Files
   *
   * @apiParam {String} id                             File id.
   *
   * @apiSuccess {Object}  file                       File obj.
   * @apiSuccess {Object}  file.data                  File data obj.
   * @apiSuccess {Object}  file.data.attributes       File attributes obj.
   * @apiSuccess {String}  file.data.attributes.url   File url.
   * @apiSuccess {String}  file.data.id               File id.
   * @apiSuccess {String}  file.data.type             File type.
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
    path: '/api/file/{id}',
    config: {
      handler: function (request, reply) {
        storageCtrl.getFile(request.params.id).then(
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
            console.log('Error:');
            console.log(new Error(err));
            reply(500, 'Internal error');
          }
        );
      }
    }
  });

  /**
   * @api {post} /api/files Request for files
   *
   *
   * @apiName GetFiles
   * @apiGroup Files
   *
   *
   * @apiSuccess {Object}   files                 files.
   * @apiSuccess {String}   files.type            file type.
   * @apiSuccess {String}   files.id              file id.
   * @apiSuccess {String}   files.attributes      file attributes.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success"
   *     }
   */
  server.route({
    method: 'GET',
    path: '/api/files',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        DAL.files.getByAuthor(request.auth.credentials.id).then(function(res) {
          reply(res.map(
            function(res) {

              res.name = res.name.replace(/\.([0-9a-z]+)(?:[\?#]|$)/, '');
              return {
                'type': 'file',
                'id': res.id,
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
};
