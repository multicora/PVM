(function (angular) {
  'use strict';
  angular.module('app').component('thumbnail', {
    templateUrl: 'components/thumbnail/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      recordData: '<'
    }
  });

  ctrl.$inject = [];
  function ctrl() {
    var vm = this;

    vm.show = function () {
      console.log(vm.recordData, '--------------');
    };
  }
})(angular);
