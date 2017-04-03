'use strict';
(function (angular) {
  angular.module('app').component('uploadPopup', {
    templateUrl: 'components/uploadPopup/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      getVideos: '&',
      showUploadPopup: '^'
    }
  });

  ctrl.$inject = [];
  function ctrl() {
    var vm = this;
    vm.showUploadPopup = false;

    vm.uploadBtnClick = function () {
      vm.showUploadPopup = true;
    };

    vm.closeUploadPopup = function () {
      vm.showUploadPopup = false;
    };

    vm.uploadEnd = function () {
      vm.closeUploadPopup();
      vm.getVideos();
    }
  }
})(angular);