(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('tools', service);

  service.$inject = [];
  function service() {
    this.os = {
      'IOS': 'IOS',
      'ANDROID': 'ANDROID',
      'OTHER': 'OTHER',
    };
    this.getOperationSystem = function() {
      var result;

      if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        result = this.os.IOS;
      } else if (/android/i.test(navigator.userAgent)) {
        result = this.os.ANDROID;
      } else {
        result = this.os.OTHER;
      }
      return result;
    };

    this.getExtension = function (fileName) {
      return fileName.split('.').pop();
    };
  }
})(angular);
