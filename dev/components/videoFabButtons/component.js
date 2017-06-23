(function (angular) {
  'use strict';
  angular.module('app').component('videoFabButtons', {
    templateUrl: 'components/videoFabButtons/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    transclude: true,
    bindings: {}
  });

  ctrl.$inject = ['uploadRecordPopupService'];
  function ctrl(uploadRecordPopupService) {
    var vm = this;

    vm.uploadBtnClick = function () {
      uploadRecordPopupService.showUploadPopup();
    };

    vm.recordBtnClick = function () {
      uploadRecordPopupService.showRecordPopup();
    };
  }
})(angular);
