'use strict';
(function (angular) {
  var app = angular.module('app');

  app.controller('conversationCtrl', ctrl);

  ctrl.$inject = [
    '$routeParams',
    '$location',
    '$rootScope',
    '$document',
    '$scope',
    'conversationsService',
    'profileService',
    'chat',
    'pubSub'
  ];
  function ctrl(
    $routeParams,
    $location,
    $rootScope,
    $document,
    $scope,
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
    vm.incomeUserPhoto = null;
    vm.showUserHeader = true;
    vm.messageClassName = 'income';
    vm.sendMessage;

    getProfile();

    pubSub.on('incomeMessage', function(data) {
      data.className = 'income';
      if (!vm.incomeUserPhoto) {
        profileService.getProfilePhoto(data.authorId).then(function(res) {
          vm.incomeUserPhoto = res.data;
          data.photo = vm.incomeUserPhoto;
          vm.chatList.push(data);
          scrollBottom();
        });
      } else {
        data.photo = vm.incomeUserPhoto;
        vm.chatList.push(data);
        reloadTemplate();
        scrollBottom();
      }
    });

    conversationsService.get($routeParams.id).then(function (res) {
      vm.conversation = res.data;
      if (vm.user && vm.conversation.author === vm.user.id) {
        vm.showUserHeader = false;
        vm.messageClassName = '';
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
      var incomeChats = [];

      vm.chatList.map(function(chat) {
        if (chat.authorId != vm.user.id) {
          vm.incomeUserPhoto = vm.incomeUserPhoto || chat.photo;
          chat.className = 'income';
          incomeChats.push(chat);
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
          $rootScope.$apply();
          scrollBottom();
        });
      }
    });

    $scope.$on('vjsVideoReady', function (e, data) {
      data.player.on('ended', function() {
        conversationsService.videoWatched(vm.conversation.id);
      });
    });

    vm.back = function (event) {
      event.stopPropagation();
      $location.path('library');
    };

    vm.contentClick = function (event) {
      vm.headerClass = 'showHeader';
    };

    vm.videoContentClick = function (event) {
      event.stopPropagation();
      vm.headerClass = 'hideHeader';
      // conversationsService.videoWatched(vm.conversation.id);
    };

    function getProfile() {
      profileService.getProfile().then(function(res) {
        vm.user = res.data;
      });
    }

    function scrollBottom() {
      var bodyElement = $document.find('body')[0];
      bodyElement.scrollTop = bodyElement.scrollHeight - bodyElement.clientHeight;
    }

    function reloadTemplate() {
      $rootScope.$apply();
    }
  }
})(angular);