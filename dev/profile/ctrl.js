(function (angular) {
  var app = angular.module('app');

  app.controller('profileCtrl', ctrl);

  ctrl.$inject = [
    '$scope',
    '$mdToast',
    'profileService'
  ];
  function ctrl(
    $scope,
    $mdToast,
    profileService
  ) {
    var vm = this;
    vm.photoError = '';
    vm.logoError = '';

    getProfile();

    vm.save = function() {
      if(vm.editMod) {
        profileService.updateProfile(vm.user).then(function(res) {
          profileService.updateCompany(vm.company)
        }).then(function(res) {
          vm.editMod = false;
          $mdToast.showSimple('Saved successfully!');
          getProfile();
        });
      } else {
        vm.editMod = true;
      }
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

    function getProfile() {
      profileService.getProfile().then(function(res) {
        vm.user = res.data;
      }).then(function() {
        return profileService.getCompany(vm.user.company)
      }).then(function(res) {
        vm.company = res.data;
      });
    };
  }
})(angular);