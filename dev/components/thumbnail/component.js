(function (angular) {
  'use strict';
  angular.module('app').component('thumbnail', {
    templateUrl: 'components/thumbnail/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      media: '<'
    }
  });

  ctrl.$inject = [];
  function ctrl() {
    var vm = this;
  }
})(angular);
