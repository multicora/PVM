'use strict';
(function (angular) {
  angular.module('app').component('uploadPopupWrapper', {
    templateUrl: 'components/uploadPopup/tplWrapper.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      getVideos: '&'
    }
  });

  ctrl.$inject = ['$rootScope'];
  function ctrl($rootScope) {
    var vm = this;

    $rootScope.$on('showUploadPopup', function() {
      vm.isShownUploadPopup = true;
    });

    $rootScope.$on('hideUploadPopup', function() {
      vm.isShownUploadPopup = false;
    });
  }
})(angular);