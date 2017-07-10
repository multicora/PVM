(function (angular) {
  'use strict';
  var app = angular.module('app');

  app.controller('conversationsCtrl', ctrl);

  ctrl.$inject = [
    '$location',
    'libraryService'
  ];
  function ctrl(
    $location,
    libraryService
  ) {
    var vm = this;
    var conversationsId = [];

    vm.showConversationIndicators = true;
    vm.toUser = true;

    getConversations();

    vm.stopPropagation = function($event) {
      $event.stopPropagation();
    };

    vm.viewConversation = function (id) {
      $location.path('conversation/' + id);
    };

    function getConversations () {
      libraryService.getConversations().then(function (res) {
        vm.conversationsList = res.data;

        vm.conversationsList.forEach(function(conversation) {
          conversationsId.push(conversation.id);
        });

        return libraryService.getEvents(conversationsId);
      }).then(function (res) {
        vm.conversationsList.forEach(function(conversation) {
          res.data.forEach(function(event) {
            if (conversation.id === event.conversationId) {
              conversation[event.type] = event.type;
            }
          });
        });

        console.log(vm.conversationsList);

        return libraryService.getConversationsToUser();
      }).then(function (res) {
        vm.conversationsToUserList = res.data;
      });
    };
  }
})(angular);
