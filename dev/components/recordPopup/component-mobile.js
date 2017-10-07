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

    vm.videoFile = null;
    vm.videoName = null;

    vm.closeRecordPopup = function () {
      uploadRecordPopupService.hideRecordPopup();
    };

    vm.finishRecord = function (file) {
      vm.videoFile = file;
    };

    vm.saveRecordClick = function (name) {
      loadingService.showSpinner();
      uploadService.sendVideo(
        name,
        vm.videoFile)
      .then(function () {
        loadingService.hideSpinner();
        vm.closeRecordPopup();
        vm.getVideos();
        vm.videoName = null;
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
        vm.videoFile)
      .then(function (res) {
        loadingService.hideSpinner();
        $location.url('template/?video=' + res.data.id);
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
  }
})(angular);
