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
    var conversationsToId = [];
    var conversationsFromId = [];
    vm.showFeedbackPopup = false;

    vm.showConversationIndicators = true;
    vm.toUser = true;

    getConversations();

    vm.stopPropagation = function($event) {
      $event.stopPropagation();
    };

    vm.viewConversation = function (id) {
      $location.path('conversation/' + id);
    };

    vm.showFeedback = function () {
      vm.showFeedbackPopup = true;
    };

    vm.closeFeedback = function () {
      vm.showFeedbackPopup = false;
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
          conversation.history = [];

          res.data.forEach(function(event) {
            event.date = convertDate(event.date);

            if (conversation[event.type]) {
              conversation[event.type].counter++;
            } else if (conversation.id === event.conversationId) {
              conversation[event.type] = event;
              conversation[event.type].counter = 1;
            }

            if (conversation.id === event.conversationId) {
              conversation.history.push(event);
            }
          });

          conversation.doneAll = (conversation.CONVERSATION_IS_VIEWED && conversation.NEW_MESSAGE &&
            conversation.VIDEO_IS_WATCHED && conversation.FILE_IS_DOWNLOADED) ? true : false;

          console.log(conversation);
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
              conversation[event.type] = event;
            }
          });
        });
      });
    };

    function convertDate(date) {
      var options = {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      };

      return new Date(date).toLocaleString('en-Us', options);
    }
  }
})(angular);
