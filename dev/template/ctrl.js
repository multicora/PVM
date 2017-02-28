(function (angular) {
  var app = angular.module('app');

  app.controller('templateCtrl', ctrl);

  ctrl.$inject = ['$routeParams', 'conversationsService'];
  function ctrl($routeParams, conversationsService) {
    var vm = this;
    vm.name = {};
    vm.companyRole = {};
    vm.message = {};
    vm.title = {};
    vm.showSendPopup = false;
    vm.snackbarClass = 'hidden-bar';

    vm.edit = function(element) {
      element.editMode = true;
      vm.snackbarClass = 'shown-bar';
    }

    vm.save = function() {
      vm.data = {
        'name': vm.name.name,
        'company_role': vm.companyRole.role,
        'message': vm.message.message,
        'title': vm.title.title,
        'logo': vm.logo,
        'video': vm.video
      }
    }

    // Send
    vm.closeSendPopup = function () {
      vm.showSendPopup = false;
    }

    vm.sendVideo = function (email) {
      conversationsService.create(email, vm.video).then(function () {
        vm.showSendPopup = false;
      });
    }
  }
})(angular);