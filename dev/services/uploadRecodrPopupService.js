(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('uploadRecordPopupService', service);

  service.$inject = ['$rootScope'];
  function service($rootScope) {
    this.showRecordPopup = function() {
      $rootScope.$broadcast('showRecordPopup');
    };

    this.showUploadPopup = function() {
      $rootScope.$broadcast('showUploadPopup');
    };

    this.hideRecordPopup = function() {
      $rootScope.$broadcast('hideRecordPopup');
    };

    this.hideUploadPopup = function() {
      $rootScope.$broadcast('hideUploadPopup');
    };
  }
})(angular);
