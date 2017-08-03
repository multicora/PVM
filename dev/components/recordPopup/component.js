(function (angular) {
  'use strict';
  angular.module('app').component('recordPopup', {
    templateUrl: 'components/recordPopup/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      getVideos: '&'
    }
  });

  ctrl.$inject = [
    '$location',
    '$mdToast',
    'uploadService',
    'uploadRecordPopupService'
  ];
  function ctrl(
    $location,
    $mdToast,
    uploadService,
    uploadRecordPopupService
  ) {
    var vm = this;

    vm.closeRecordPopup = function () {
      uploadRecordPopupService.hideRecordPopup();
    };

    vm.finishRecord = function (data) {
      vm.recordedData = data;
    };

    vm.saveRecordClick = function (name) {
      name = name || 'no name';
      uploadService.sendFile(
        '/api/video',
        vm.recordedData.video,
        name + '.wmv'
      ).then(function () {
        vm.closeRecordPopup();
        vm.getVideos();
        vm.videoName = null;
        $mdToast.show(
          $mdToast.simple()
            .textContent('Video saved successfully!')
            .position('bottom center')
            .hideDelay(3000)
        );
      }).catch(function (err) {
        // TODO: add error style
        $mdToast.show(
          $mdToast.simple()
            .textContent(err.data.error)
            .position('bottom center')
            .hideDelay(3000)
        );
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
