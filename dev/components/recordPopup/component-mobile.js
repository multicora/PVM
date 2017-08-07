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
      save(name).then(function () {
        vm.closeRecordPopup();
        vm.getVideos();
        vm.videoName = null;
      });
    };


    vm.sendRecordClick = function (name) {
      save(name).then(function (res) {
        $location.url('template/?video=' + res.data.id);
      });
    };

    function save(name) {
      name = name || 'no name';
      return uploadService.sendFile(
        '/api/video',
        vm.videoFile,
        name + '.' + tools.getExtension(vm.videoFile.name));
    }
  }
})(angular);
