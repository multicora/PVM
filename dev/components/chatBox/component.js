'use strict';
(function (angular) {
  angular.module('app').component('chatBox', {
    templateUrl: 'components/chatBox/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    transclude: true,
    bindings: {
    }
  });

  ctrl.$inject = [];
  function ctrl() {
    var vm = this;
  }
})(angular);