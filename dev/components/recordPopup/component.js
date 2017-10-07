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
    'uploadRecordPopupService',
    'loadingService'
  ];
  function ctrl(
    $location,
    $mdToast,
    uploadService,
    uploadRecordPopupService,
    loadingService
  ) {
    var vm = this;

    vm.closeRecordPopup = function () {
      uploadRecordPopupService.hideRecordPopup();
    };

    vm.finishRecord = function (data) {
      vm.recordedData = data;
    };

    vm.saveRecordClick = function (name) {
      loadingService.showSpinner();
      uploadService.sendVideo(
        name,
        vm.recordedData.video)
      .then(function () {
        vm.closeRecordPopup();
        vm.getVideos();
        vm.videoName = null;
        loadingService.hideSpinner();
        $mdToast.show(
          $mdToast.simple()
            .textContent('Video saved successfully!')
            .position('bottom center')
            .hideDelay(3000)
        );
      }).catch(function (err) {
        loadingService.hideSpinner();
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
      loadingService.showSpinner();
      uploadService.sendVideo(
        name,
        vm.recordedData.video)
      .then(function (res) {
        loadingService.hideSpinner();
        $location.url('template/?video=' + res.data.id);
      }, function(err) {
        loadingService.hideSpinner();
        $mdToast.show(
          $mdToast.simple()
            .textContent(err.data.error)
            .position('bottom center')
            .hideDelay(3000)
        );
      });
    };
  }
})(angular);
