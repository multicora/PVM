(function (angular) {
  'use strict';
  angular.module('app').component('recordPopupWrapper', {
    templateUrl: 'components/recordPopup/tplWrapper.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      getVideos: '&'
    }
  });

  ctrl.$inject = [
    '$rootScope',
    'tools'
  ];
  function ctrl(
    $rootScope,
    tools
  ) {
    var vm = this;

    $rootScope.$on('showRecordPopup', function() {
      var os = tools.getOperationSystem();

      if (os === tools.os.IOS || os === tools.os.ANDROID) {
        vm.isShownRecordPopupMobile = true;
      } else {
        vm.isShownRecordPopup = true;
      }
    });

    $rootScope.$on('hideRecordPopup', function() {
      vm.isShownRecordPopupMobile = false;
      vm.isShownRecordPopup = false;
    });
  }
})(angular);
