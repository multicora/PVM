'use strict';
(function (angular) {
  var app = angular.module('app');

  app.controller('conversationCtrl', ctrl);

  ctrl.$inject = [
    '$routeParams',
    '$location',
    'conversationsService',
    'profileService',
    'chat',
    'pubSub'
  ];
  function ctrl(
    $routeParams,
    $location,
    conversationsService,
    profileService,
    chat,
    pubSub
  ) {
    var vm = this;
    var sendObj;

    vm.conversation = null;
    vm.media = null;
    vm.user = null;
    vm.showUserHeader = true;
    vm.sendMessage;

    getProfile();

    pubSub.on('incomeMessage', function(data) {
      data.className = 'income';
      vm.chatList.push(data);
    });

    conversationsService.get($routeParams.id).then(function (res) {
      vm.conversation = res.data;
      if (vm.user && vm.conversation.author === vm.user.id) {
        vm.showUserHeader = false;
      }
      vm.media = {
        sources: [{
          src: vm.conversation.url,
          type: 'video/mp4'
        }]
      };
    }).then(function() {
      return conversationsService.getChat($routeParams.id);
    }).then(function(res) {
      vm.chatList = res.data;

      vm.chatList.map(function(chat) {
        if (chat.authorId != vm.user.id) {
          chat.className = 'income';
        } else {
          chat.photo = vm.user.photo;
        }
      });
    });

    chat.connect().then(function (chatInstance) {
      vm.sendMessage = function(message) {
        sendObj = {
          'message': message,
          'authorId': vm.user.id,
          'conversationId': vm.conversation.id
        }
        chatInstance.send(sendObj, function() {
          sendObj.photo = vm.user.photo;
          vm.chatList.push(sendObj);
        });
      }
    });

    vm.back = function (event) {
      event.stopPropagation();
      $location.path('library');
    }

    vm.contentClick = function (event) {
      vm.headerClass = 'showHeader';
    }

    vm.videoContentClick = function (event) {
      event.stopPropagation();
      vm.headerClass = 'hideHeader';
    }

    function getProfile() {
      profileService.getProfile().then(function(res) {
        vm.user = res.data;
      });
    };
  }
})(angular);