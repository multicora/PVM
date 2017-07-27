(function (angular) {
  'use strict';
  var app = angular.module('app');

  app.controller('conversationsCtrl', ctrl);

  ctrl.$inject = [
    '$location',
    'libraryService',
    'conversationsService'
  ];
  function ctrl(
    $location,
    libraryService,
    conversationsService
  ) {
    var vm = this;
    var conversationsToId = [];
    var conversationsFromId = [];

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
          conversationsToId.push(conversation.id);
        });

        return libraryService.getEvents(conversationsToId);
      }).then(function (res) {
        vm.conversationsList.forEach(function(conversation) {
          res.data.forEach(function(event) {
            if (conversation.id === event.conversationId) {
              conversation[event.type] = event.type;
            }
          });
        });

        var promisses = [];

        conversationsToId.forEach(function(id) {
          promisses.push(conversationsService.getChat(id));
        });

        return Promise.all(promisses);
      }).then(function (res) {
        var chats = [];
        res.map(function(chat) {
          var lastChat = chat.data[0];
          for (var i = 0; i < chat.data.length; i++) {
            if (lastChat.date < chat.data[i].date) {
              lastChat = chat.data[i];
            }
          }

          chats.push(lastChat);
        });

        conversationsList.forEach(function(conversation) {
          chats.forEach(function(chat) {
            if (conversation.id === chat.conversationId) {
              conversation.lastMessage = chat.message;
            }
          })
        });

        return libraryService.getConversationsToUser();
      }).then(function (res) {
        vm.conversationsToUserList = res.data;

        vm.conversationsToUserList.forEach(function(conversation) {
          conversationsFromId.push(conversation.id);
        });

        return libraryService.getEvents(conversationsFromId);
      }).then(function (res) {
        vm.conversationsToUserList.forEach(function(conversation) {
          res.data.forEach(function(event) {
            if (conversation.id === event.conversationId) {
              conversation[event.type] = event.type;
            }
          });
        });

        console.log(vm.conversationsList, vm.conversationsToUserList);
      });
    };
  }
})(angular);
