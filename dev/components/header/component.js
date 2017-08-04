(function (angular) {
  'use strict';
  angular.module('app').component('appHeader', {
    templateUrl: 'components/header/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      showFeedback: '&',
      closeFeedback: '&'
    }
  });

  ctrl.$inject = [
    '$location',
    '$mdSidenav',
    '$mdToast',
    'storage',
    'profileService'
  ];
  function ctrl(
    $location,
    $mdSidenav,
    $mdToast,
    storage,
    profileService
  ) {
    var vm = this;
    var tokenName = 'x-biz-token';

    vm.user = null;
    vm.unreadedMessage = null;


    vm.isAuthenticated = !!storage.get(tokenName);
    getProfile();

    vm.redirect = function(url, urlParam) {
      if (urlParam) {
        return $location.path(url + '/' + urlParam);
      } else {
        return $location.path(url);
      }
    };

    vm.openMenu = function () {
      $mdSidenav('left').toggle();
    };

    function getProfile() {
      profileService.getProfile().then(function(res) {
        vm.user = res.data;
      }).catch(function () {
        vm.user = null;
      });
    };
  }
})(angular);
