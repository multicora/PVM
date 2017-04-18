'use strict';
(function (angular) {
  angular.module('app').component('chatList', {
    templateUrl: 'components/chatList/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    transclude: true,
    bindings: {
      list: '<'
    }
  });

  ctrl.$inject = [
  ];
  function ctrl(
  ) {
    var vm = this;
  }
})(angular);