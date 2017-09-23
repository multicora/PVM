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
    'libraryService',
    'storage',
    'utils',
    'eventHub'
  ];
  function ctrl(
    $routeParams,
    $location,
    $rootScope,
    $document,
    $scope,
    conversationsService,
    profileService,
    libraryService,
    storage,
    utils,
    eventHub
  ) {
    // TODO: add users avatars
    var vm = this;
    var usersPhotos = {};
    // var audio = utils.createAudio('/files/audio/filling-your-inbox.mp3');
    var conversationId = $routeParams.id;
    vm.sendMessage = null;
    vm.conversation = null;
    vm.media = null;
    vm.user = null;
    vm.showUserHeader = true;
    vm.showUserFooter = true;
    vm.messageClassName = 'income';
    vm.showLoginPopup = false;
    vm.videoWatched = false;

    getProfile();
    getConversation();

    eventHub.sub('chat_' + conversationId, function (/* message */) {
      getConversation();
      // data.className = 'income';
      // data.photo = usersPhotos[data.authorId];
      // vm.chatList.push(data);
      // audio.play();
      // reloadTemplate();
      // scrollBottom();
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
      if (!vm.videoWatched) {
        data.player.on('pause', function() {
          conversationsService.videoPaused({
            conversationId: vm.conversation.id,
            videoId: vm.conversation.videoId,
            time: data.player.currentTime()
          });
        });
      }
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

    vm.sendMessage = function(message) {
      if (vm.user) {
        conversationsService.sendMessage(
          vm.conversation.id,
          {
            message: message,
            authorId: vm.user.id,
          }
        );
      }
    };

    function getConversation() {
      conversationsService.get(conversationId).then(function (res) {
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
        return libraryService.getEvents([vm.conversation.id]);
      }).then(function(res) {

        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].type === 'VIDEO_IS_WATCHED') {
            vm.videoWatched = true;
            break;
          }
        }

        return conversationsService.getChat(conversationId);
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
      }).catch(function () {
        vm.user = null;
        vm.sendMessage = function(data) {
          vm.showLoginPopup = true;
          storage.set('message', data);
        };
      });
    }

    // function scrollBottom() {
    //   var bodyElement = $document.find('body')[0];
    //   bodyElement.scrollTop = bodyElement.scrollHeight - bodyElement.clientHeight;
    // }

    // function reloadTemplate() {
    //   $rootScope.$apply();
    // }
  }
})(angular);
