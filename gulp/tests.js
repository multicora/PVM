'use strict';

var gulp = require('gulp');
var Server = require('karma').Server;
var sequence = require('gulp-sequence');

var karmaConfigPath = __dirname + '/../karma.conf.js';
var tasksList = ['compile-pug', 'app-js', 'lib-js'];

module.exports = function() {
  /**
   * Run test with watch
   */
  gulp.task('test', function (done) {
    sequence(tasksList, function () {
      new Server({
        configFile: karmaConfigPath,
        singleRun: false
      }, function() {
          done();
      }).start();
    });
  });

  /**
   * Run test once and exit
   */
  gulp.task('testOnce', function (done) {
    sequence(tasksList, function () {
      new Server({
        configFile: karmaConfigPath,
        singleRun: true
      }, function() {
          done();
      }).start();
    });
  });
};
