'use strict';
(function (angular) {
  angular.module('app').component('uploadPopup', {
    templateUrl: 'components/uploadPopup/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      getVideos: '&'
    }
  });

  ctrl.$inject = ['uploadRecordPopupService'];
  function ctrl(uploadRecordPopupService) {
    var vm = this;

    vm.closeUploadPopup = function () {
      uploadRecordPopupService.hideUploadPopup();
    };

    vm.uploadEnd = function () {
      vm.closeUploadPopup();
      vm.getVideos();
    };
  }
})(angular);