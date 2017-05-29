'use strict';
(function (angular) {
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

  ctrl.$inject = ['$scope'];
  function ctrl($scope) {
    var vm = this;
  }
})(angular);