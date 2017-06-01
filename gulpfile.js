// TODO: add source map

var gulp = require('gulp');
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var pug = require('gulp-pug');
var connect = require('gulp-connect');
var order = require('gulp-order');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minCss = require('gulp-clean-css');
var minJs = require('gulp-uglify');
var log = require('gulp-util').log;
var bowerFiles = require('main-bower-files');
var gulpfilter = require('gulp-filter');
var openUrl = require('gulp-open');
var sequence = require('gulp-sequence');
var modrewrite = require('connect-modrewrite');
var debug = require('gulp-debug'); // e.g .pipe(debug({title: 'unicorn:'}))
var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');
var apidoc = require('gulp-api-doc');
var install = require('gulp-install');

var beConfig = require('./backend/config.js');

var config = require('./gulp/config.js')();
var path = config.path;
// var config = {
//   autoprefixer: {
//     browsers: ['last 2 versions'],
//     cascade: false
//   },
//   scssOrder: ['**/app.scss'],
//   jsOrder: ['**/app.js', '**/appConfig.js']
// };

// var path = {};
// path.dev = 'dev';
// path.be = 'backend';
// path.dest = 'backend/public';
// path.pug = path.dev + '/**/*.pug';
// path.css = path.dev + '/**/*.scss';
// path.js = path.dev + '/**/!(*spec).js';
// path.assets = path.dev + '/files/**/*';

require('./gulp/tests.js')();
require('./gulp/jslint.js')();

gulp.task('compile-pug', function() {
  return gulp.src(path.pug)
    .pipe( plumber() )
    .pipe( pug() )
    .on('error', log)
    .pipe( gulp.dest(path.dest) )
    .pipe( connect.reload() )
});

//  compile app.css file (default readable, --prod to minify)
gulp.task('app-css', function () {
  return gulp.src(path.css)
    .pipe( order(config.scssOrder) )
    .pipe(sourcemaps.init())
    .pipe( concat('app.css') )
    .pipe( plumber() )
    .pipe( sass() )
    .pipe( autoprefixer(config.autoprefixer) )
    .pipe( minCss() )
    .pipe(sourcemaps.write())
    .on('error', log )
    .pipe( gulp.dest(path.dest) )
    .pipe( connect.reload() );
});

//  compile app.js file (default readable, --prod to minify)
gulp.task('app-js', function () {
  return gulp.src(path.js)
    .pipe( plumber() )
    .pipe( order(config.jsOrder) )
    .pipe(sourcemaps.init())
    .pipe( concat('app.js') )
    // .pipe( minJs() )
    .pipe(sourcemaps.write())
    .on( 'error', log )
    .pipe( gulp.dest(path.dest) )
    .pipe( connect.reload() );
});

//  compile lib.js file from bower_components (default readable, --prod to minify)
gulp.task('lib-js', function () {
  var filter = gulpfilter(['**/**.js']);

  return gulp.src(bowerFiles())
    .pipe(filter)
    .pipe( plumber() )
    .pipe( concat('libs.js') )
    .on('error', log )
    .pipe( gulp.dest(path.dest) );
});

//  compile lib.css file from bower_components (default min)
gulp.task('lib-css', function () {
  var filter = gulpfilter(['**/**.css']);

  return gulp.src(bowerFiles())
    .pipe(filter)
    .pipe( plumber() )
    .pipe( concat('libs.css') )
    .on('error', log )
    .pipe( gulp.dest(path.dest) );
});

gulp.task('copy-lib-fonts' , function () {
  var filterFonts = gulpfilter(['**/**.otf', '**/**.eot', '**/**.svg', '**/**.ttf', '**/**.woff', '**/**.woff2']);
  // var filterFonts = gulpfilter(['**/**.svg']);

  gulp.src( bowerFiles() )
    .pipe(filterFonts)
    .pipe( gulp.dest(path.dest + '/fonts') )
});

//  copy font files, image files, etc.
gulp.task('assets', function () {
  return gulp.src(path.assets)
    .pipe( gulp.dest(path.dest + '/files') );
});

// Dev tasks
gulp.task('server', function() {
  var port = beConfig.server.port || 443;

  return connect.server({
    root: path.dest,
    port: 9000,
    livereload: true,
    fallback: path.dest + '/index.html',
    middleware: function(connect, o) {
      return [
        modrewrite(
          [
            '^/api/(.*)$ https://localhost:' + port + '/api/$1 [P]',
          ]
        )
      ];
    }
  });
});

gulp.task('watch', function() {
  gulp.watch(path.js, ['app-js']);
  gulp.watch(path.pug, ['compile-pug']);
  gulp.watch(path.css, ['app-css']);
  return gulp.watch(path.assets, ['assets']);
});

gulp.task('openUrl', function() {
  return gulp.src(__filename)
    .pipe( openUrl({uri: 'http://localhost:9000/'}) );
});

gulp.task('clean', function() {
  return gulp.src(path.dest, {read: false})
    .pipe(clean());
});

gulp.task('install', function() {
  return gulp.src(['./bower.json', './package.json'])
    .pipe(install({allowRoot: true}));
});

gulp.task('backend', function() {
  return nodemon({
    script: path.be + '/index.js',
    watch: [path.be, '!' + path.dest],
    tasks: ['apidoc', 'belint']
  });
});

gulp.task('apidoc', function () {
  return gulp.src(path.be + '/routing')
    .pipe(apidoc())
    .pipe(gulp.dest('documentation'));
});

// gulp.task('belint', function () {
//   return gulp.src([path.be + '/**/*.js', '!' + path.be + '/public/**/*.js'])
//     .pipe(eslint({
//       envs: [
//         'node',
//         'es6',
//         'mocha'
//       ],
//       "rules": {
//         "block-scoped-var": 2,
//         "guard-for-in": 2,
//         "no-alert": 2,
//         "no-array-constructor": 2,
//         "no-caller": 2,
//         "no-catch-shadow": 2,
//         "no-labels": 2,
//         "no-eval": 2,
//         "no-extend-native": 2,
//         "no-extra-bind": 2,
//         "no-implied-eval": 2,
//         "no-iterator": 2,
//         "no-label-var": 2,
//         "no-labels": 2,
//         "no-lone-blocks": 2,
//         "no-loop-func": 2,
//         "no-multi-spaces": 2,
//         "no-multi-str": 2,
//         "no-native-reassign": 2,
//         "no-new": 2,
//         "no-new-func": 2,
//         "no-new-object": 2,
//         "no-new-wrappers": 2,
//         "no-octal-escape": 2,
//         "no-process-exit": 2,
//         "no-proto": 2,
//         "no-return-assign": 2,
//         "no-script-url": 2,
//         "no-sequences": 2,
//         "no-shadow-restricted-names": 2,
//         "no-spaced-func": 2,
//         "no-trailing-spaces": 2,
//         "no-undef": 2,
//         "no-undef-init": 2,
//         "no-unused-expressions": [2, {"allowTernary": true}],
//         "no-unused-vars": 2,
//         "no-use-before-define": [2, { "functions": false, "variables": true }],
//         "no-with": 2,
//         "camelcase": 2,
//         "comma-spacing": 2,
//         "consistent-return": 2,
//         "curly": [2, "all"],
//         "dot-notation": [2, { "allowKeywords": true }],
//         "eol-last": 2,
//         "no-extra-parens": [2, "functions"],
//         "eqeqeq": 2,
//         "key-spacing": [2, { "beforeColon": false, "afterColon": true }],
//         "new-cap": 2,
//         "new-parens": 2,
//         "quotes": [2, "single"],
//         "semi": 2,
//         "semi-spacing": [2, {"before": false, "after": true}],
//         "space-infix-ops": 2,
//         "keyword-spacing": 2,
//         "space-unary-ops": [2, { "words": true, "nonwords": false }],
//         "strict": 2,
//         "radix": 2,
//         "yoda": [2, "never"]
//       },
//       extends: "eslint:recommended",
//       useEslintrc: false
//     }))
//     .pipe(eslint.format())
//     .pipe(eslint.failAfterError());
// });
// --------------------------------------------------

var buildTasks = ['assets', 'compile-pug', 'app-js', 'lib-js', 'app-css', 'lib-css', 'copy-lib-fonts', 'apidoc'];

gulp.task('build', function() {
  return sequence(['clean'], ['install'], buildTasks, function () {
      return log(' -| Builded');
    }
  );
});

gulp.task('dev', function() {
  return sequence(['clean'], ['install'], ['belint'], buildTasks, ['backend', 'server'], ['watch'], 'openUrl', function() {
    return log(' -| Runned');
  });
});

gulp.task('dev2', function() {
  return sequence(['clean'], ['install'], ['belint'], buildTasks, ['server'], ['watch'], 'openUrl', function() {
    return log(' -| Runned');
  });
});