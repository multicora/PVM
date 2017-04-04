'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('fabButtonsService', service);

  service.$inject = [];
  function service() {
    var isUploadPopupShown = false;
    var isRecordPopupShown = false;

    this.showUploadPopup = function () {
      isUploadPopupShown = true;
    }

    this.showRecordPopup = function () {
      isRecordPopupShown = true;
    }

    this.hideUploadPopup = function () {
      isUploadPopupShown = false;
    }

    this.hideRecordPopup = function () {
      isRecordPopupShown = false;
    }
  }
})(angular);