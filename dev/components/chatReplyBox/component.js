'use strict';
(function (angular) {
  angular.module('app').component('chatReplyBox', {
    templateUrl: 'components/chatReplyBox/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    transclude: true,
    bindings: {
      sendMessage: '&'
    }
  });

  ctrl.$inject = [
  ];
  function ctrl(
  ) {
    var vm = this;
    vm.send = function () {
      vm.sendMessage({$data: vm.message});
      vm.message = null;
    }
  }
})(angular);