'use strict';
(function (angular) {
  angular.module('app').component('appHeader', {
    templateUrl: 'components/header/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
    }
  });

  ctrl.$inject = ['$location', 'tokenService'];
  function ctrl($location, tokenService) {
    var vm = this;

    vm.isAuthenticated = !!tokenService.getToken();

    vm.invalidateSession = function () {
      tokenService.clearToken();
      $location.path('/login');
    };
  }
})(angular);