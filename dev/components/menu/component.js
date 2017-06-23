(function (angular) {
  'use strict';
  angular.module('app').component('appMenu', {
    templateUrl: 'components/menu/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      className: '@'
    }
  });

  ctrl.$inject = [
    '$location',
    'tokenService'
  ];
  function ctrl(
    $location,
    tokenService
  ) {
    var vm = this;

    vm.redirect = function(url, urlParam) {
      if (urlParam) {
        return $location.path(url + '/' + urlParam);
      } else {
        return $location.path(url);
      }
    };

    vm.invalidateSession = function () {
      tokenService.clearToken();
      $location.path('/login');
    };
  }
})(angular);
