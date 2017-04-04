'use strict';
(function (angular) {
  angular.module('app').component('uploadPopup', {
    templateUrl: 'components/uploadPopup/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
    }
  });

  ctrl.$inject = ['fabButtonService'];
  function ctrl(fabButtonService) {
    vm.closeUploadPopup = function () {
      vm.showUploadPopup = false;
    };

    vm.uploadEnd = function () {
      vm.closeUploadPopup();
      vm.getVideos();
    }
  }
})(angular);