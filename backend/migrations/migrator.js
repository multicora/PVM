'use strict';

const _ = require('lodash');

module.exports = function (DAL, options) {
  options = options || {};

  const DEBUG = false;

  options.getDbVersion(DAL, function (v) {
    if (v) {
      versionCb(v, DAL);
    } else {
      options.setDbVersion(DAL, 0, _.bind(versionCb, null, 0));
    }
  });

  function versionCb(v) {
    var migrations = fillMigrations(options.migrations || []);

    console.log('    Current DB version: ' + v);

    runAllMigrations(
      migrations,
      parseInt(v, 10),
      DAL,
      function (v) {
        if (!DEBUG) {
          console.log('    DB version: ' + v);
        }
        options.done();
      }
    );
  }

  function fillMigrations(migrations) {
    let mg = {};

    migrations.forEach(function (migration) {
      if (mg[migration.version]) {
        console.log('    Migration with this version already exists.');
      } else {
        mg[migration.version] = migration;
      }
    });

    return mg;
  }

  function runAllMigrations(migrations, currentDbVersion, DAL, doneCallback) {
    var index = currentDbVersion;

    next(migrations, index + 1, DAL, doneCallback);

    function next (migrations, v, DAL, cb) {
      var currentMigration = migrations[v];

      if (currentMigration) {
        runMigration(
          currentMigration.script,
          currentMigration.message,
          function () {
            if (!DEBUG) {
              options.setDbVersion(
                DAL,
                v,
                _.bind(next, null, migrations, v + 1, DAL, cb)
              );
            } else {
              next(migrations, v + 1, DAL, cb);
            }
          }
        );
      } else {
        cb(v - 1, DAL);
      }
    }
  }

  // migrationFunc {function(next)}
  // msg {string}
  // callback {function}
  function runMigration (migrationFunc, msg, callback) {
    migrationFunc(
      _.bind(migrationEnd, null, msg, callback)
    );
  }

  function migrationEnd(msg, cb, err) {
    if (err) {
      console.log('    Error while migrating:');
      console.log(err);
    } else {
      console.log('    Finished: ' + msg);
      cb();
    }
  }
};