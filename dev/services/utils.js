(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('utils', service);

  function service() {
    this.createAudio = function(src) {
      return new Audio(src);
    };

    this.checkExt = function(name) {
      var ext = name.split('.').pop();
      ext = (ext === 'wmv') ? 'webm' : (ext === 'mov' ? 'mp4' : ext);
      return ext;
    };
  }
})(angular);
