'use strict';
(function (angular) {
  angular.module('app').component('popup', {
    templateUrl: 'components/popup/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    transclude: true,
    bindings: {
      onEsc: '&',
      onEnter: '&',
      closePopup: '&',
    }
  });

  ctrl.$inject = ['$timeout', '$window'];
  function ctrl($timeout, $window) {
    var vm = this;

    vm.stopPropagation = function($event) {
      $event.stopPropagation();
    }

    vm.onkeyDown = function(event) {
      var keyCode = event.which || event.keyCode;
      event.stopPropagation();
      if (keyCode === 27) {
        vm.onEsc();
      } else if (keyCode === 13 && vm.onEnter) {
        if (vm.form && !vm.form.$submitted) {
          vm.form.$submitted = true;
        }
        vm.onEnter();
      }
    };
  }
})(angular);