(function (angular) {
  'use strict';
  var app = angular.module('app');

  app.controller('conversationsCtrl', ctrl);

  ctrl.$inject = [
    '$location',
    'libraryService',
    'translations'
  ];
  function ctrl(
    $location,
    libraryService,
    translations
  ) {
    var vm = this;
    var conversationsToId = [];
    var conversationsFromId = [];
    vm.showFeedbackPopup = false;
    vm.showConversationIndicators = true;
    vm.toUser = true;
    vm.showFullLogPopup = false;
    vm.fullLogs = null;

    getConversations();

    vm.showFullLog = function($event, data) {
      $event.stopPropagation();
      vm.fullLogs = data;
      vm.showFullLogPopup = true;
    };

    vm.closeFullLogPopup = function() {
      vm.showFullLogPopup = false;
      vm.fullLogs = null;
    };

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

    function dateGenerator(date) {
      date = new Date(date);
      return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    }

    function getConversations () {
      libraryService.getConversations().then(function (res) {
        vm.conversationsList = res.data;

        vm.conversationsList.forEach(function(conversation) {
          conversationsToId.push(conversation.id);
        });

        return libraryService.getEvents(conversationsToId);
      }).then(function (res) {
        vm.conversationsList.forEach(function(conversation) {
          var history = [];

          res.data.forEach(function(event) {
            if (conversation[event.type]) {
              conversation[event.type].counter++;
            } else if (conversation.id === event.conversationId) {
              conversation[event.type] = event;
              conversation[event.type].counter = 1;
            }

            if (conversation.id === event.conversationId) {
              event.message = translations.txt(event.type);
              history.push(event);
            }
          });
          conversation.sortedHistory = {};

          history.forEach(function(event) {
            if (!conversation.sortedHistory[dateGenerator(event.date)]) {
              conversation.sortedHistory[dateGenerator(event.date)] = new Array(event);
            } else {
              conversation.sortedHistory[dateGenerator(event.date)].push(event);
            }
          });

          conversation.doneAll = (conversation.CONVERSATION_IS_VIEWED && conversation.NEW_MESSAGE &&
            conversation.VIDEO_IS_WATCHED && conversation.FILE_IS_DOWNLOADED) ? true : false;
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
  }
})(angular);
