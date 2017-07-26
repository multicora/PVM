(function (angular) {
  'use strict';
  var app = angular.module('app');

  app.controller('usersCtrl', ctrl);

  ctrl.$inject = [
    '$location',
    'usersService'
  ];
  function ctrl(
    $location,
    usersService
  ) {
    var vm = this;

    vm.showAddPopup = false;

    var getUsers = function () {
      usersService.getUsers().then(function (res) {
        vm.users = res.data;
      });
    };

    getUsers();

    vm.addUser = function () {
      vm.showAddPopup = true;
    };

    vm.closeAddPopup = function () {
      vm.showAddPopup = false;
    };

    vm.redirect = function (id) {
      $location.path('user/' + id);
    };

    vm.inviteUser = function (email, name) {
      usersService.inviteUser({
        email: email,
        name: name || ''
      }).then(function () {
        vm.closeAddPopup();
        getUsers();
      });
    };

    vm.blockUser = function (id) {
      usersService.blockUser(id).then(function () {
        getUsers();
      });
    };

    vm.unblockUser = function (id) {
      usersService.unblockUser(id).then(function () {
        getUsers();
      });
    };
  }
})(angular);
