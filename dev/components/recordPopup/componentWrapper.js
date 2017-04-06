'use strict';
(function (angular) {
  angular.module('app').component('recordPopupWrapper', {
    templateUrl: 'components/recordPopup/tplWrapper.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      getVideos: '&'
    }
  });

  ctrl.$inject = ['$rootScope'];
  function ctrl($rootScope) {
    var vm = this;

    $rootScope.$on('showRecordPopup', function() {
      vm.isShownRecordPopup = true;
    });

    $rootScope.$on('hideRecordPopup', function() {
      vm.isShownRecordPopup = false;
    });
  }
})(angular);