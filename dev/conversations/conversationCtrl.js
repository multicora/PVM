(function (angular) {
  var app = angular.module('app');

  app.controller('conversationCtrl', ctrl);

  ctrl.$inject = [
    '$routeParams',
    '$location',
    'conversationsService',
    'profileService'
  ];
  function ctrl(
    $routeParams,
    $location,
    conversationsService,
    profileService
  ) {
    var vm = this;

    vm.conversation = null;
    vm.media = null;
    vm.showUserHeader = true;
    getProfile();

    conversationsService.get($routeParams.id).then(function (res) {
      vm.conversation = res.data;
      if (vm.conversation.author === vm.user.id) {
        vm.showUserHeader = false;
      }
      vm.media = {
        sources: [{
          src: vm.conversation.url,
          type: 'video/mp4'
        }]
      };
    });

    vm.back = function () {
      $location.path('library');
    }

    function getProfile() {
      profileService.getProfile().then(function(res) {
        vm.user = res.data;
      }, function(err) {
        vm.user.id = null;
      });
    };
  }
})(angular);