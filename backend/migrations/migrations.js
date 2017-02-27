'use strict';

const migrator = require('./migrator.js');

module.exports = function (DAL, cb) {
  const migrationOptions = {
    setDbVersion: setDbVersion,
    getDbVersion: getDbVersion,
    migrations: [
      require('./scripts/v001.js')(DAL),
      require('./scripts/v002.js')(DAL),
      require('./scripts/v003.js')(DAL),
      require('./scripts/v004.js')(DAL),
      require('./scripts/v005.js')(DAL),
      require('./scripts/v006.js')(DAL),
      require('./scripts/v007.js')(DAL),
      require('./scripts/v008.js')(DAL),
      require('./scripts/v009.js')(DAL),
      require('./scripts/v010.js')(DAL),
      require('./scripts/v011.js')(DAL),
      require('./scripts/v012.js')(DAL),
      require('./scripts/v013.js')(DAL),
      require('./scripts/v014.js')(DAL),
      require('./scripts/v015.js')(DAL),
      require('./scripts/v016.js')(DAL),
      require('./scripts/v017.js')(DAL),
      require('./scripts/v018.js')(DAL),
      require('./scripts/v019.js')(DAL),
      require('./scripts/v020.js')(DAL),
      require('./scripts/v021.js')(DAL),
      require('./scripts/v022.js')(DAL),
      require('./scripts/v023.js')(DAL),
      require('./scripts/v024.js')(DAL),
      require('./scripts/v025.js')(DAL),
      require('./scripts/v026.js')(DAL),
      require('./scripts/v027.js')(DAL),
      require('./scripts/v028.js')(DAL),
      require('./scripts/v029.js')(DAL),
      require('./scripts/v030.js')(DAL),
      require('./scripts/v031.js')(DAL),
      require('./scripts/v032.js')(DAL)
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
      );
    }
  );
}

function getDbVersion(DAL, cb) {
  DAL.settings.getByName('version', function (err, res) {
    const v = res && res[0] && res[0].value;
    cb(v || 0);
  });
}
