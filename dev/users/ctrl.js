(function (angular) {
  'use strict';
  var app = angular.module('app');

  app.controller('usersCtrl', ctrl);

  ctrl.$inject = ['usersService'];
  function ctrl(usersService) {
    var vm = this;

    vm.showAddPopup = false;

    var getUsers = function () {
      usersService.getUsers().then(function (res) {
        vm.users = res.data;
        console.log(vm.users);
      });
    };

    getUsers();

    vm.addUser = function () {
      vm.showAddPopup = true;
    };

    vm.closeAddPopup = function () {
      vm.showAddPopup = false;
    };

    vm.inviteUser = function (email, name) {
      usersService.inviteUser({
        email: email,
        name: name
      }).then(function () {
        vm.closeAddPopup();
        getUsers();
      });
    };

    vm.blockUser = function (id) {
      console.log(id);
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
