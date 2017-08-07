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
      save(name).then(function () {
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
      save(name).then(function (res) {
        $location.path('template/?video=' + res.data.id);
      });
    };

    function save(name) {
      name = name || 'no name';
      return uploadService.sendFile(
        '/api/video',
        vm.recordedData.video,
        name + '.wmv');
    }
  }
})(angular);
