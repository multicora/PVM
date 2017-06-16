(function (angular) {
  'use strict';
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
    '$localStorage'
  ];
  function ctrl(
    $localStorage
  ) {
    var vm = this;

    if ($localStorage.message) {
      vm.message = $localStorage.message;
      delete $localStorage.message;
    }

    vm.send = function () {
      vm.sendMessage({$data: vm.message});
      vm.message = null;
      vm.savedMessage = null;
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
