(function (angular) {
  'use strict';
  var app = angular.module('app');

  app.controller('dashboardCtrl', ctrl);

  ctrl.$inject = [
    '$scope',
    '$location',
    '$mdToast',
    'conversationsService',
    'libraryService'
  ];
  function ctrl(
    $scope,
    $location,
    $mdToast,
    conversationsService,
    libraryService
  ) {
    var vm = this;
    var types = {
      'CONVERSATION_IS_VIEWED': 'CONVERSATION_IS_VIEWED',
      'VIDEO_IS_WATCHED': 'VIDEO_IS_WATCHED',
      'VIDEO_IS_WATCHING': 'VIDEO_IS_WATCHING',
      'FILE_IS_DOWNLOADED': 'FILE_IS_DOWNLOADED'
    };
    vm.sentConversation = 0;
    vm.openedConversation = 0;
    vm.videoIsWatched = 0;
    vm.fileIsDownloaded = 0;
    vm.messages = null;

    getConversation();
    conversationsService.getChatForDashboard().then(function (res) {
      vm.messages = res.data;
      var length = vm.messages.length;
      var i;

      // TODO: move to separate function
      // TODO: use "[].sort()" function
      for (i = 0; i < length - 1; i++) {
        for (var j = 0; j < length - 1 - i; j++) {
          if (vm.messages[j + 1].date > vm.messages[j].date) {
            var first = vm.messages[j + 1];
            vm.messages[j + 1] = vm.messages[j];
            vm.messages[j] = first;
          }
        }
      }

      // TODO: move to separate function
      vm.messages = vm.messages.slice(0, 5);
      for (i = 0; i < vm.messages.length; i++) {
        var date = new Date();
        vm.messages[i].date = new Date(vm.messages[i].date);

        vm.messages[i].passedTime = date.getTime() - vm.messages[i].date.getTime();

        vm.messages[i].passedTime = formatTime(vm.messages[i].passedTime);
      }

    });

    vm.redirectToConversation = function (id) {
      $location.path('conversation/' + id);
    };

    function getConversation() {
      // TODO: add .catch() part
      conversationsService.getByAuthor().then(function (res) {
        let conversationsId = [];
        vm.conversations = res.data;
        vm.sentConversation = vm.conversations.length;

        vm.conversations.forEach(function(conversation) {
          conversationsId.push(conversation.id);
        });
        return libraryService.getEvents(conversationsId);
      }).then(function(res) {
        res.data.forEach(function(event) {
          if (event.type === types.CONVERSATION_IS_VIEWED) {
            vm.openedConversation++;
          } else  if (event.type === types.VIDEO_IS_WATCHED) {
            vm.videoIsWatched++;
          } else  if (event.type === types.FILE_IS_DOWNLOADED) {
            vm.fileIsDownloaded++;
          }
        });
      });
    }

    function formatTime (time) {
      if (time < 60000) {
        time = new Date(time).getSeconds() + ' sec';
      } else if (time < 3600000) {
        time = new Date(time).getMinutes() + ' min';
      } else if (time < 86400000) {
        time = new Date(time).getHours() + ' hrs';
      } else if (time) {
        time = new Date(time).getDay() + ' days';
      }

      return time;
    }
  }
})(angular);
