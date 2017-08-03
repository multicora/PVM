(function (angular) {
  'use strict';
  angular.module('app').component('recordMobilePopup', {
    templateUrl: 'components/recordPopup/tplMobile.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      getVideos: '&'
    }
  });

  ctrl.$inject = [
    '$location',
    'uploadService',
    'uploadRecordPopupService',
    'tools'
  ];
  function ctrl(
    $location,
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

    vm.saveRecordClick = function (name) {
      name = name || 'no name';
      uploadService.sendFile(
        '/api/video',
        vm.videoFile,
        name + '.' + tools.getExtension(vm.videoFile.name)
      ).then(function () {
        vm.closeRecordPopup();
        vm.getVideos();
        vm.videoName = null;
      });
    };


    vm.sendRecordClick = function (name) {
      name = name || 'no name';
      uploadService.sendFile(
        '/api/video',
        vm.recordedData.video,
        name + '.wmv'
      ).then(function (res) {
        $location.url('template/?video=' + res.data.id);
      });
    };
  }
})(angular);
