(function (angular) {
  'use strict';
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
    var usersPhotos = {};

    vm.conversation = null;
    vm.media = null;
    vm.user = null;
    vm.showUserHeader = true;
    vm.messageClassName = 'income';
    vm.sendMessage = null;

    getProfile();

    pubSub.on('incomeMessage', function(data) {
      data.className = 'income';
      if (!usersPhotos[data.authorId]) {
        profileService.getProfilePhoto(data.authorId).then(function(res) {
          if (!res.data) {
            usersPhotos[data.authorId] = 'no photo';
          } else {
            usersPhotos[data.authorId] = res.data;
          }
          data.photo = usersPhotos[data.authorId];
          vm.chatList.push(data);
        });
      } else {
        data.photo = usersPhotos[data.authorId];
        vm.chatList.push(data);
        reloadTemplate();
      }

      scrollBottom();
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
        if (chat.authorId !== vm.user.id) {
          chat.className = 'income';
          incomeChats.push(chat);
        }

        if (chat.photo) {
          usersPhotos[chat.authorId] = chat.photo;
        }
      });
    });

    chat.connect().then(function (chatInstance) {
      vm.sendMessage = function(message) {
        sendObj = {
          'message': message,
          'authorId': vm.user.id,
          'conversationId': vm.conversation.id
        };

        chatInstance.send(sendObj, function() {
          sendObj.photo = vm.user.photo;
          vm.chatList.push(sendObj);
          $rootScope.$apply();
          scrollBottom();
        });
      };
    });

    $scope.$on('vjsVideoReady', function (e, data) {
      data.player.one('ended', function() {
        conversationsService.videoWatched(vm.conversation.id);
      });
      data.player.one('click', function() {
        conversationsService.videoIsWatching(vm.conversation.id);
      });
    });

    vm.back = function (event) {
      event.stopPropagation();
      $location.path('library');
    };

    vm.contentClick = function () {
      vm.headerClass = 'showHeader';
    };

    vm.onFileClick = function() {
      conversationsService.fileDownloaded(vm.conversation.id);
    };

    vm.videoContentClick = function (event) {
      event.stopPropagation();
      vm.headerClass = 'hideHeader';
    };

    function getProfile() {
      profileService.getProfile().then(function(res) {
        vm.user = res.data;
      }).catch(function () {
        vm.user = null;
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
