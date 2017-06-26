(function (angular) {
  'use strict';
  angular.module('app').component('chatReplyBox', {
    templateUrl: 'components/chatReplyBox/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    transclude: true,
    bindings: {
      sendMessage: '&',
      message: '='
    }
  });

  ctrl.$inject = [
  ];
  function ctrl(
  ) {
    var vm = this;

    vm.send = function () {
      vm.message = vm.message;
      vm.sendMessage({$data: vm.message});
      vm.message = null;
    };

    vm.onkeyDown = function(event) {
      event.stopPropagation();
      var keyCode = event.which || event.keyCode;
      if (keyCode === 13 && vm.message) {
        event.preventDefault();
        vm.send();
      }
    };
  }
})(angular);
