(function (angular) {
  var app = angular.module('app');

  app.controller('usersCtrl', ctrl);

  ctrl.$inject = ['usersService'];
  function ctrl(usersService) {
    var vm = this;

    vm.showAddPopup = false;

    vm.getUsers = function () {
      usersService.getUsers().then(function (res) {
        vm.users = res.data;
        console.log(vm.users);
      })
    };

    vm.getUsers();

    vm.addUser = function () {
      vm.showAddPopup = true;
    }

    vm.closeAddPopup = function () {
      vm.showAddPopup = false;
    }

    vm.inviteUser = function (email) {
      usersService.inviteUser(email).then(function () {
        vm.closeAddPopup();
      });
    }

    vm.blockUser = function (id) {
      console.log(id);
      usersService.blockUser(id).then(function () {
        vm.getUsers();
      });
    }

    vm.unblockUser = function (id) {
      usersService.unblockUser(id).then(function () {
        vm.getUsers();
      });
    }
  }
})(angular);