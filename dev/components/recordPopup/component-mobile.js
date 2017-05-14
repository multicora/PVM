'use strict';
(function (angular) {
  angular.module('app').component('recordMobilePopup', {
    templateUrl: 'components/recordPopup/tplMobile.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      getVideos: '&'
    }
  });

  ctrl.$inject = [
    'uploadService',
    'uploadRecordPopupService',
    'tools'
  ];
  function ctrl(
    uploadService,
    uploadRecordPopupService,
    tools
  ) {
    var vm = this;

    vm.videoFile = null;
    vm.videoName = null;

    vm.closeRecordPopup = function () {
      uploadRecordPopupService.hideRecordPopup();
    };

    vm.finishRecord = function (file) {
      vm.videoFile = file;
    };

    vm.sendRecordClick = function (name) {
      name = name || 'no name';
      uploadService.sendFile(
        "/api/video",
        vm.videoFile,
        name + '.' + tools.getExtension(vm.videoFile.name)
      ).then(function () {
        vm.closeRecordPopup();
        vm.getVideos();
        vm.videoName = null;
      });
    };
  }
})(angular);