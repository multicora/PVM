(function (angular) {
  'use strict';
  angular.module('app').component('dashboardCard', {
    templateUrl: 'components/dashboardCard/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      className: '@',
      title: '@',
      icon: '@',      
      data: '<'
    }
  });

  ctrl.$inject = [
  ];
  function ctrl(
  ) {
  }
})(angular);
