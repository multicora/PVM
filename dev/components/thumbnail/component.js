(function (angular) {
  'use strict';
  angular.module('app').component('thumbnail', {
    templateUrl: 'components/thumbnail/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      showGenerator: '@',
      recordData: '<'
    }
  });

  ctrl.$inject = [];
  function ctrl() {
    var vm = this;

    console.log(vm.recordData, '-----------------', vm.showGenerator);
  }
})(angular);
