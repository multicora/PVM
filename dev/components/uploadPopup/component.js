'use strict';
(function (angular) {
  angular.module('app').component('uploadPopup', {
    templateUrl: 'components/uploadPopup/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
    }
  });

  ctrl.$inject = ['fabButtonsService'];
  function ctrl(fabButtonsService) {
    vm.closeUploadPopup = function () {
      fabButtonsService.hideUploadPopup();
    };

    vm.uploadEnd = function () {
      vm.closeUploadPopup();
      vm.getVideos();
    }
  }
})(angular);