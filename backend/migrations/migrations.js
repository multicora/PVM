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
      require('./scripts/v032.js')(DAL),
      require('./scripts/v033.js')(DAL),
      require('./scripts/v034.js')(DAL),
      require('./scripts/v035.js')(DAL),
      require('./scripts/v036.js')(DAL),
      require('./scripts/v037.js')(DAL),
      require('./scripts/v038.js')(DAL),
      require('./scripts/v039.js')(DAL),
      require('./scripts/v040.js')(DAL),
      require('./scripts/v041.js')(DAL),
      require('./scripts/v042.js')(DAL),
      require('./scripts/v043.js')(DAL),
      require('./scripts/v044.js')(DAL),
      require('./scripts/v045.js')(DAL),
      require('./scripts/v046.js')(DAL),
      require('./scripts/v047.js')(DAL),
      require('./scripts/v048.js')(DAL),
      require('./scripts/v049.js')(DAL),
      require('./scripts/v050.js')(DAL),
      require('./scripts/v051.js')(DAL),
      require('./scripts/v052.js')(DAL),
      require('./scripts/v053.js')(DAL),
      require('./scripts/v054.js')(DAL),
      require('./scripts/v055.js')(DAL),
      require('./scripts/v056.js')(DAL),
      require('./scripts/v057.js')(DAL),
      require('./scripts/v058.js')(DAL),
      require('./scripts/v059.js')(DAL),
      require('./scripts/v060.js')(DAL),
      require('./scripts/v061.js')(),
      require('./scripts/v062.js')(),
      require('./scripts/v063.js')(),
      require('./scripts/v064.js')(),
      require('./scripts/v065.js')(),
      require('./scripts/v066.js')(),
      require('./scripts/v067.js')(),
      require('./scripts/v068.js')(),
      require('./scripts/v069.js')(),
      require('./scripts/v070.js')(),
      require('./scripts/v071.js')(),
      require('./scripts/v072.js')(),
      require('./scripts/v073.js')(),
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
