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
    });

    chat.connect().then(function (chatInstance) {
      console.log(111111111111111);
      chatInstance.send('Test');
    });

    vm.sendMessage = function(message) {
      chat.message(message);
    }

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