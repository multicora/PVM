'use strict';
(function (angular) {
  angular.module('app').component('appHeader', {
    templateUrl: 'components/header/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
    }
  });

  ctrl.$inject = ['$location', 'tokenService', 'profileService'];
  function ctrl($location, tokenService, profileService) {
    var vm = this;

    function getProfile() {
      profileService.getProfile().then(function(res) {
        vm.company = res.data[0];
        vm.user = res.data[1];
      });
    };

    vm.isAuthenticated = !!tokenService.getToken();
    getProfile();

    vm.redirect = function(url, urlParam) {
      if (urlParam) {
        return $location.path(url + '/' + urlParam);
      } else {
        return $location.path(url);
      }
    }

    vm.invalidateSession = function () {
      tokenService.clearToken();
      $location.path('/login');
    };
  }
})(angular);