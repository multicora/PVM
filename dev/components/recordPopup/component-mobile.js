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
    'uploadRecordPopupService'
  ];
  function ctrl(
    $location,
    uploadService,
    uploadRecordPopupService
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
      uploadService.sendVideo(
        name,
        '/api/video',
        vm.videoFile)
      .then(function () {
        vm.closeRecordPopup();
        vm.getVideos();
        vm.videoName = null;
      });
    };


    vm.sendRecordClick = function (name) {
      uploadService.sendVideo(
        name,
        '/api/video',
        vm.videoFile)
      .then(function (res) {
        $location.url('template/?video=' + res.data.id);
      });
    };
  }
})(angular);
