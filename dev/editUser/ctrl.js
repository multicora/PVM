(function (angular) {
  'use strict';
  var app = angular.module('app');

  app.controller('editUserCtrl', ctrl);

  ctrl.$inject = ['$routeParams', 'usersService', '$location'];
  function ctrl($routeParams, usersService, $location) {
    var vm = this;

    usersService.getUserById($routeParams.id).then(function (res) {
      vm.user = res.data;
    });

    vm.editUser = function () {
      usersService.updateUser(vm.user).then(function () {
        $location.path('/users');
      });
    };
  }
})(angular);
