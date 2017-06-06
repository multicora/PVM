(function (angular) {
  'use strict';
  angular.module('app').component('chatList', {
    templateUrl: 'components/chatList/tpl.html',
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
