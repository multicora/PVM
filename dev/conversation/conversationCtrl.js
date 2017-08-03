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
    'pubSub',
    'storage'
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
    pubSub,
    storage
  ) {
    var vm = this;
    var sendObj;
    var usersPhotos = {};
    var chatInstance;
    var audio = new Audio('/files/audio/filling-your-inbox.mp3');
    // audio.play();
    vm.sendMessage = null;
    vm.conversation = null;
    vm.media = null;
    vm.user = null;
    vm.showUserHeader = true;
    vm.showUserFooter = true;
    vm.messageClassName = 'income';
    vm.showLoginPopup = false;

    getProfile();
    getConversation();

    pubSub.on('incomeMessage', function(data) {
      data.className = 'income';
      data.photo = usersPhotos[data.authorId];
      vm.chatList.push(data);
      audio.play();
      reloadTemplate();
      scrollBottom();
    });

    chat.connect().then(function (res) {
      chatInstance = res;
    });

    $scope.$on('vjsVideoReady', function (e, data) {
      data.player.one('ended', function() {
        conversationsService.videoWatched({
          conversationId: vm.conversation.id,
          videoId: vm.conversation.videoId
        });
      });
      data.player.one('click', function() {
        conversationsService.videoIsWatching({
          conversationId: vm.conversation.id,
          videoId: vm.conversation.videoId
        });
      });
    });

    vm.back = function (event) {
      event.stopPropagation();
      $location.path('conversations');
    };

    vm.contentClick = function () {
      vm.headerClass = 'showHeader';
    };

    vm.onFileClick = function (fileId) {
      conversationsService.fileDownloaded({
        conversationId: vm.conversation.id,
        fileId: fileId
      });
    };

    vm.videoContentClick = function (event) {
      event.stopPropagation();
      vm.headerClass = 'hideHeader';
    };

    vm.closeLoginPopup = function () {
      vm.showLoginPopup = false;
    };

    vm.onSuccessLogin = function () {
      vm.closeLoginPopup();
      getProfile();
      getConversation();
    };

    function getConversation() {
      conversationsService.get($routeParams.id).then(function (res) {
        vm.conversation = res.data;
        if (vm.user && vm.conversation.author === vm.user.id) {
          vm.showUserHeader = false;
          vm.showUserFooter = false;
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
          } else {
            usersPhotos[chat.authorId] = undefined;
          }
        });

        vm.savedMessage = storage.get('message') || null;
        if (vm.savedMessage) {
          storage.clear('message');
        }
      });
    }

    function getProfile() {
      profileService.getProfile().then(function(res) {
        vm.user = res.data;
        vm.sendMessage = function(message) {
          sendObj = {
            'message': message,
            'authorId': vm.user.id,
            'conversationId': vm.conversation.id
          };

          chatInstance.send(sendObj, function() {
            sendObj.photo = vm.user.photo;
            vm.chatList.push(sendObj);
            reloadTemplate();
            scrollBottom();
          });
        };
      }).catch(function () {
        vm.user = null;
        vm.sendMessage = function(data) {
          vm.showLoginPopup = true;
          storage.set('message', data);
        };
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
