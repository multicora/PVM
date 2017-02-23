(function (angular) {
  var app = angular.module('app');

  app.controller('profileCtrl', ctrl);

  ctrl.$inject = ['profileService', '$scope'];
  function ctrl(profileService, $scope) {
    var vm = this;
    vm.photoError = '';
    vm.logoError = '';

    function getProfile() {
      profileService.getProfile().then(function(res) {
        vm.company = res.data[0];
        vm.user = res.data[1];
      });
    };

    getProfile();

    vm.save = function() {
      profileService.updateProfile(vm.user, vm.company).then(function(res) {
        getProfile();
        vm.editMod = false;
      });
    }

    $scope.convertToBase64Photo = function(event) {
      var f = document.getElementById('photo').files[0],
          r = new FileReader(),
          size = (f.size >= 524288),
          type = (f.type.indexOf('image') >= 0);
      if (size || !type) {
        vm.photoError = 'File is too large or isn`t image, please choose another file!';
      } else {
        vm.photoError = '';
        r.onloadend = function(e) {
          // TODO: converted to base64 image
          vm.user.photo = e.target.result;
          $scope.$digest();
        }
        r.readAsDataURL(f);
      }
      $scope.$apply();
    }

    $scope.convertToBase64Logo = function(event) {
      var f = document.getElementById('logo').files[0],
          r = new FileReader(),
          size = (f.size >= 524288),
          type = (f.type.indexOf('image') >= 0);
      if (size || !type) {

        vm.logoError = 'File is too large or isn`t image, please choose another file!';
      } else {
        vm.logoError = '';
        r.onloadend = function(e) {
          // TODO: converted to base64 image
          vm.company.logo = e.target.result;
          $scope.$digest();
        }
        r.readAsDataURL(f);
      }
      $scope.$apply();
    }
  }
})(angular);