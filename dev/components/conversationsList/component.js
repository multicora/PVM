(function (angular) {
  'use strict';
  angular.module('app').component('conversationList', {
    templateUrl: 'components/conversationsList/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      onViewClick: '&',
      onIndicatorClick: '&',
      onFullLogClick: '&',
      showIndicators: '<',
      list: '<',
      events: '<',
      toUser: '<'
    }
  });

  ctrl.$inject = [];
  function ctrl() {
    var vm = this;

    vm.expand = function(event, item) {
      event.stopPropagation();
      vm.list.forEach(function(conversation) {
        conversation.expandClass = '';
      });
      item.expandClass = 'expanded';
    };

    vm.collapse = function(event, item) {
      event.stopPropagation();
      item.expandClass = '';
    };
  }
})(angular);
