(function (angular) {
  'use strict';
  angular.module('app').component('thumbnail', {
    templateUrl: 'components/thumbnail/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      video: '&',
    }
  });

  ctrl.$inject = [];
  function ctrl() {
  }
})(angular);
