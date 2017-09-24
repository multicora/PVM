(function (angular) {
  'use strict';
  angular.module('app').component('chatBox', {
    templateUrl: 'components/chatBox/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    transclude: true,
    bindings: {
      list: '<'
    }
  });

  ctrl.$inject = [];
  function ctrl() {
  }
})(angular);
