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
   * @apiSuccess {String}  file.data.id               File id.
   * @apiSuccess {String}  file.data.type             File type.
   * @apiSuccess {Object}  file.data.attributes       File attributes obj.
   * @apiSuccess {String}  file.data.attributes.url   File url.
   * @apiSuccess {String}  file.data.attributes.size  File size.
   * @apiSuccess {String}  file.data.attributes.name  File name.
   * @apiSuccess {String}  file.data.attributes.date  File date.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *  {
   *    "data": {
   *      "type": "video",
   *      "id": "10",
   *      "attributes": {
   *        "url": "https://dl.boxcloud.com/d/1/A0nI9YwUM_Dfmt4WGLzSXS/download",
   *        "name": "name"
   *        "size": "83922"
   *        "date": " 2017-05-22T12:48:02.000Z"
   *      }
   *    }
   *  }
   */
  server.route({
    method: 'GET',
    path: '/api/file/{id}',
    config: {
      handler: function (request, reply) {
        let file;
        storageCtrl.getFile(request.params.id).then( res => {
          file = {
            type: 'file',
            attributes: {
              url: res
            }
          };

          return DAL.files.getById(request.params.id);
        }).then( res => {
          file.id = res.id;
          file.attributes.date = res.date;
          file.attributes.name = res.name;
          file.attributes.size = res.size;

          reply(file);
        }).catch( err => {
          reply(Boom.badImplementation(500, err));
        });
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

  /**
   * @api {post} /api/delete-file Request for delete file
   *
   * @apiParam {string}   id                 File id.
   *
   * @apiName DeleteFile
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
    path: '/api/delete-file',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        DAL.files.delete(request.payload).then(() => {
          reply({'status': 'success'});
        }, err => {
          reply(Boom.badImplementation(err, err));
        });
      }
    }
  });
};
