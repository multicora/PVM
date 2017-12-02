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

  ctrl.$inject = ['notificationsService'];
  function ctrl(notificationsService) {
    var vm = this;

    vm.unreadMessagesByConversationId = {};

    notificationsService.getUnreadMessage().then(function(res) {
      res.data.forEach(function (item) {
        vm.unreadMessagesByConversationId[item.conversationId] = item;
      });
    });

    vm.expand = function(event, item) {
      event.stopPropagation();
      vm.list.forEach(function(conversation) {
        conversation.expandClass = '';
        conversation.fullLogShow = false;
        conversation.timelineShow = false;
        conversation.explainShow = false;
      });
      item.expandClass = 'expanded';
      item.fullLogShow = true;
      item.timelineShow = true;
      item.explainShow = true;
    };

    vm.collapse = function(event, item) {
      event.stopPropagation();
      item.expandClass = '';
      item.fullLogShow = false;
      item.timelineShow = false;
      item.explainShow = false;
    };
  }
})(angular);
