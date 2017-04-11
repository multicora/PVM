'use strict';
(function (angular) {
  angular.module('app').component('chatReplyBox', {
    templateUrl: 'components/chatReplyBox/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    transclude: true,
    bindings: {
    }
  });

  ctrl.$inject = [
  ];
  function ctrl(
  ) {
    var vm = this;
  }
})(angular);