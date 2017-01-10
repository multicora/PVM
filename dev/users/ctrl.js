(function (angular) {
  var app = angular.module('app');

  app.controller('usersCtrl', ctrl);

  ctrl.$inject = ['usersService'];
  function ctrl(usersService) {
    var vm = this;

    usersService.getUsers().then(function (res) {
      vm.users = res.data;
      console.log(vm.users);
    })
  }
})(angular);