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
    '$mdDialog',
    '$localStorage',
    'conversationsService',
    'profileService',
    'chat',
    'pubSub',
    'authService',
    'tokenService',
    'translations'
  ];
  function ctrl(
    $routeParams,
    $location,
    $rootScope,
    $document,
    $scope,
    $mdDialog,
    $localStorage,
    conversationsService,
    profileService,
    chat,
    pubSub,
    authService,
    tokenService,
    translations
  ) {
    var vm = this;
    var sendObj;

    var EMAIL_IS_NOT_CONFIRMED = 'EMAIL_IS_NOT_CONFIRMED';
    var unconfirmedEmailPopup = $mdDialog.confirm({
      title: translations.txt('CONFIRM_YOUR_EMAIL'),
      textContent: translations.txt('LOGIN_PAGE_CONFIRM_YOUR_EMAIL_MESSAGE'),
      ok: translations.txt('RESEND_CONFIRMATION'),
      cancel: translations.txt('CANCEL')
    });

    vm.sendMessage = null;
    vm.conversation = null;
    vm.media = null;
    vm.user = null;
    vm.incomeUserPhoto = null;
    vm.showUserHeader = true;
    vm.messageClassName = 'income';
    vm.showLoginPopup = false;

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
        if (chat.authorId !== vm.user.id) {
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

    vm.onFileClick = function () {
      conversationsService.fileDownloaded(vm.conversation.id);
    };

    vm.videoContentClick = function (event) {
      event.stopPropagation();
      vm.headerClass = 'hideHeader';
    };

    vm.closeLoginPopup = function () {
      vm.showLoginPopup = false;
    };

    vm.login = function(login, password) {
      authService.login(login, password).then(function (res) {
        tokenService.setToken(res.data.token);
        vm.showLoginPopup = false;
      }, function(err) {
        if (err.data.message === EMAIL_IS_NOT_CONFIRMED) {
          $mdDialog
            .show( unconfirmedEmailPopup ).then(function() {
              authService.resendConfirmMail(login);
            });
        } else {
          vm.errorLogin = translations.txt(err.data.message);
        }
      });
    };

    vm.register = function(email, password, confirmPassword) {
      authService.register(email, password, confirmPassword).then(function() {
        vm.errorRegister = '';
        vm.selectedIndex = 0;
      }, function(err) {
        vm.errorRegister = err.data.message;
      });
    };

    function getProfile() {
      profileService.getProfile().then(function(res) {
        vm.user = res.data;
      }).catch(function () {
        vm.user = null;
        vm.sendMessage = function(data) {
          vm.showLoginPopup = true;
          $localStorage.message = data;
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
