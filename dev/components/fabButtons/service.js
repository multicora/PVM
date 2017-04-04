'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('fabButtonService', service);

  service.$inject = [];
  function service() {
    var isUploadPopupShown = false;
    var isRecordPopupShown = false;

    this.onShowUploadPopup = function () {

    }
  }
})(angular);