'use strict';
(function (angular) {
  angular.module('app').component('conversationList', {
    templateUrl: 'components/conversationsList/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      viewe: '&',
      list: '<',
    }
  });

  ctrl.$inject = [];
  function ctrl() {
    var vm = this;
  }
})(angular);