(function (angular) {
  var app = angular.module('app');

  app.controller('conversationCtrl', ctrl);

  ctrl.$inject = ['$routeParams', 'conversationsService'];
  function ctrl($routeParams, conversationsService) {
    var vm = this;

    vm.showChatBox = false;

    conversationsService.get($routeParams.id).then(function (res) {
      console.log(res.data);
    });

    vm.chatBoxClick = function () {
      vm.showChatBox = true;
    };
  }
})(angular);