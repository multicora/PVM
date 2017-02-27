(function (angular) {
  var app = angular.module('app');

  app.controller('conversationCtrl', ctrl);

  ctrl.$inject = ['$routeParams', 'conversationsService'];
  function ctrl($routeParams, conversationsService) {
    var vm = this;

    vm.showChatBox = false;
    vm.conversation = null;
    vm.media = null;

    conversationsService.get($routeParams.id).then(function (res) {
      vm.conversation = res.data;
      vm.media = {
        sources: [{
          src: vm.conversation.url,
          type: 'video/mp4'
        }]
      };
    });

    vm.chatBoxClick = function () {
      vm.showChatBox = true;
    };
  }
})(angular);