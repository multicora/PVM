'use strict';

const migrator = require('./migrator.js');

module.exports = function (DAL, cb) {
  const migrationOptions = {
    setDbVersion: setDbVersion,
    getDbVersion: getDbVersion,
    migrations: [
      require('./scripts/v001.js')(DAL),
    ],
    done: cb
  };

  migrator(DAL, migrationOptions);
};

function setDbVersion(DAL, v, cb) {
  DAL.settings.create(
    function() {
      DAL.settings.update(
        {
          name: 'version',
          value: v
        },
        function (res) {
          const v = res && res.version;
          cb(v);
        }
      )
    }
  );
}

function getDbVersion(DAL, cb) {
  DAL.settings.getByName('version', function (err, res) {
    const v = res && res[0] && res[0].value;
    cb(v || 0);
  });
}