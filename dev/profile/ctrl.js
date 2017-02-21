(function (angular) {
  var app = angular.module('app');

  app.controller('profileCtrl', ctrl);

  ctrl.$inject = ['profileService'];
  function ctrl(profileService) {
    var vm = this;

    var getProfile = function() {
      profileService.getProfile().then(function(res) {
        vm.company = res.data[0];
        vm.user = res.data[1];
      });
    };

    getProfile();

    vm.save = function() {
      profileService.updateProfile(vm.user, vm.company).then(function(res) {
        getProfile();
      });
    }
  }
})(angular);