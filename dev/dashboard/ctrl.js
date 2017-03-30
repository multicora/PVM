(function (angular) {
  var app = angular.module('app');

  app.controller('dashboardCtrl', ctrl);

  ctrl.$inject = [
    'conversationsService'
  ];
  function ctrl(
    conversationsService
  ) {
    var vm = this;
    vm.sentConversation = 0;
    vm.openedConversation = 0;

    getConversation();

    function getConversation() {
      conversationsService.getByAuthor().then(function (res) {
        vm.conversations = res.data;

        vm.sentConversation = vm.conversations.length;
        vm.conversations.map(function(conversation) {
          if (conversation.viewed) {
            vm.openedConversation++;
          }
        });
      });
    }
  }
})(angular);