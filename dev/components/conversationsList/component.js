(function (angular) {
  'use strict';
  angular.module('app').component('conversationList', {
    templateUrl: 'components/conversationsList/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      onViewClick: '&',
      onIndicatorClick: '&',
      showIndicators: '<',
      list: '<',
      toUser: '<'
    }
  });

  ctrl.$inject = [];
  function ctrl() {
  }
})(angular);
