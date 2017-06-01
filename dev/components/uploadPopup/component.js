(function (angular) {
  'use strict';
  angular.module('app').component('uploadPopup', {
    templateUrl: 'components/uploadPopup/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      getVideos: '&'
    }
  });

  ctrl.$inject = [
    'uploadRecordPopupService',
    '$mdToast'
  ];
  function ctrl(
    uploadRecordPopupService,
    $mdToast
  ) {
    var vm = this;

    vm.closeUploadPopup = function () {
      uploadRecordPopupService.hideUploadPopup();
    };

    vm.uploadEnd = function () {
      vm.closeUploadPopup();
      vm.getVideos();
      $mdToast.show(
        $mdToast.simple()
          .textContent('Uploaded!')
          .position('bottom center')
          .hideDelay(3000)
      );
    };
  }
})(angular);
