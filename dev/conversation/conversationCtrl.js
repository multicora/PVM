(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.controller('conversationCtrl', ctrl);

  ctrl.$inject = [
    '$routeParams',
    '$rootScope',
    '$location',
    '$document',
    '$timeout',
    '$scope',
    '$q',
    'conversationsService',
    'profileService',
    'libraryService',
    'storage',
    'utils',
    'eventHub'
  ];

  function ctrl(
    $routeParams,
    $rootScope,
    $location,
    $document,
    $timeout,
    $scope,
    $q,
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
    var audio = utils.createAudio('/files/audio/filling-your-inbox.mp3');
    var conversationId = $routeParams.id;
    vm.conversation = null;
    vm.media = null;
    vm.user = null;
    vm.showUserHeader = true;
    vm.showUserFooter = true;
    vm.messageClassName = 'income';
    vm.showLoginPopup = false;
    vm.videoWatched = false;
    vm.conversationIsNotFound = false;

    getProfile();
    getConversation();

    eventHub.sub('chat_' + conversationId, function( /* message */ ) {
      getChat(conversationId).then(function() {
        var lastMessage = vm.messages[vm.messages.length - 1];

        if (lastMessage.authorId !== vm.user.id) {
          audio.play();
        }
        scrollBottom();
      }).then(function() {
        return loadPhotos();
      });
    });

    $scope.$on('vjsVideoReady', function(e, data) {
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

    vm.back = function(event) {
      event.stopPropagation();
      $location.path('conversations');
    };

    vm.contentClick = function() {
      vm.headerClass = 'showHeader';
    };

    vm.onFileClick = function(fileId) {
      conversationsService.fileDownloaded({
        conversationId: vm.conversation.id,
        fileId: fileId
      });
    };

    vm.videoContentClick = function(event) {
      event.stopPropagation();
      vm.headerClass = 'hideHeader';
    };

    vm.closeLoginPopup = function() {
      vm.showLoginPopup = false;
    };

    vm.onSuccessLogin = function() {
      vm.closeLoginPopup();
      getProfile();
      getConversation();
    };

    vm.sendMessage = function(message) {
      if (vm.user) {
        var messageData = {
          message: message,
          authorId: vm.user.id,
        };
        conversationsService.sendMessage(
          vm.conversation.id,
          messageData
        );
        vm.messages.push(messageData);
        scrollBottom();
      } else {
        vm.showLoginPopup = true;
        storage.set('message', message);
      }
    };

    function getConversation() {
      return conversationsService.get(conversationId).then(function(res) {
        vm.conversation = res.data;
        if (vm.user && vm.conversation.author === vm.user.id) {
          vm.showUserHeader = false;
          vm.showUserFooter = false;
          vm.messageClassName = '';
        }

        vm.videoType = function() {

          var type =
            vm.conversation.url.indexOf('webm') !== -1 ? 'video/webm' :
            vm.conversation.url.indexOf('mp4') !== -1 ? 'video/mp4' :
            'video/quicktime';
          return type;

        };

        vm.media = {
          sources: [{
            src: vm.conversation.url,
            type: vm.videoType()
          }]
        };

        // OGVJS player

        vm.player = new OGVPlayer();
        vm.player.classList.add('video-js');
        vm.player.src = vm.conversation.url;
        var videoHolder = document.getElementById('videoHolder');
        if (vm.conversation.url.indexOf('webm') !== -1) {
          videoHolder.append(vm.player);
        }

      }).then(function() {
        if (vm.user) {
          return libraryService.getEvents([vm.conversation.id]);
        }
        return null;
      }).then(function(res) {
        if (res) {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].type === 'VIDEO_IS_WATCHED') {
              vm.videoWatched = true;
              break;
            }
          }
        }

        return getChat(conversationId);
      }).then(function() {
        vm.savedMessage = storage.get('message') || null;
        if (vm.savedMessage) {
          storage.clear('message');
        }
      }).then(function() {
        return loadPhotos();
      }).catch(function(err) {
        if (err.status === 404) {
          vm.conversationIsNotFound = true;
        }
      });
    }

    function getProfile() {
      profileService.getProfile().then(function(res) {
        vm.user = res.data;
      }).catch(function() {
        vm.user = null;
      });
    }

    function scrollBottom() {
      $timeout(function() {
        var bodyElement = $document.find('body')[0];
        bodyElement.scrollTop = bodyElement.scrollHeight - bodyElement.clientHeight;
      }, 0);
    }

    function getChat(conversationId) {
      return conversationsService.getChat(conversationId).then(function(res) {
        vm.messages = res.data;
        var incomeChats = [];

        vm.messages.map(function(message) {
          if (message.authorId !== vm.user.id) {
            message.className = 'income';
            incomeChats.push(message);
          }
        });
      });
    }

    function loadPhotos() {
      var needToLoad = vm.messages.filter(function(message) {
        return !usersPhotos.hasOwnProperty(message.authorId);
      }).map(function(message) {
        return message.authorId;
      }).filter(function(value, index, self) {
        return self.indexOf(value) === index;
      });

      setPhotos();

      return $q.all(
        needToLoad.map(function(userId) {
          return profileService.getProfilePhoto(userId);
        })
      ).then(function(res) {
        needToLoad.forEach(function(userId, index) {
          usersPhotos[userId] = res[index].data;
        });

        setPhotos();
      });
    }

    function setPhotos() {
      vm.messages.forEach(function(message) {
        if (!message.photo) {
          message.photo = usersPhotos[message.authorId];
        }
      });
    }
  }
})(angular);
