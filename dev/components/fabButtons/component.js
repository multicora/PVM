'use strict';
(function (angular) {
  angular.module('app').component('fabButtons', {
    templateUrl: 'components/fabButtons/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    transclude: true,
    bindings: {
    }
  });

  ctrl.$inject = [];
  function ctrl() {
    var vm = this;
  }
})(angular);