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
    'storage'
  ];
  function ctrl(
    $location,
    storage
  ) {
    var vm = this;
    var tokenName = 'x-biz-token';

    vm.url = $location.url();

    vm.redirect = function(url, urlParam) {
      if (urlParam) {
        return $location.path(url + '/' + urlParam);
      } else {
        return $location.path(url);
      }
    };

    vm.invalidateSession = function () {
      storage.clear(tokenName);
      $location.path('/login');
    };
  }
})(angular);
