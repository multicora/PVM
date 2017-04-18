(function (angular) {
  var app = angular.module('app');

  app.controller('conversationCtrl', ctrl);

  ctrl.$inject = [
    '$routeParams',
    '$location',
    'conversationsService',
    'profileService',
    'chat'
  ];
  function ctrl(
    $routeParams,
    $location,
    conversationsService,
    profileService,
    chat
  ) {
    var vm = this;

    vm.conversation = null;
    vm.media = null;
    vm.user = null;
    vm.showUserHeader = true;
    vm.sendMessage;
    getProfile();

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
      vm.chat = res.data;
      console.log(vm.chat);
    });

    chat.connect().then(function (chatInstance) {
      vm.sendMessage = function(message) {
        chatInstance.send({
          'message': message,
          'authorId': vm.user.id,
          'conversationId': vm.conversation.id
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