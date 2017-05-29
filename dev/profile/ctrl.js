(function (angular) {
  'use strict';
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
      if (vm.editMod) {
        vm.user.company = vm.user.company || '';
        vm.user.companyPosition = vm.user.companyPosition || '';
        vm.user.firstName = vm.user.firstName || '';
        vm.user.secondName = vm.user.secondName || '';
        vm.user.phone = vm.user.phone || '';
        vm.user.photo = vm.user.photo || '';

        profileService.updateProfile(vm.user).then(function() {
          profileService.updateCompany(vm.company);
        }).then(function() {
          vm.editMod = false;
          getProfile();
          $mdToast.show(
            $mdToast.simple()
              .textContent('Saved successfully!')
              .position('bottom center')
              .hideDelay(3000)
          );
        }).catch(function (err) {
          // TODO: add error style
          $mdToast.show(
            $mdToast.simple()
              .textContent(err.data.error)
              .position('bottom center')
              .hideDelay(3000)
          );
        });
      } else {
        vm.editMod = true;
      }
    };

    $scope.convertToBase64Photo = function() {
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
        };
        r.readAsDataURL(f);
      }
      $scope.$apply();
    };

    $scope.convertToBase64Logo = function() {
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
        };
        r.readAsDataURL(f);
      }
      $scope.$apply();
    };

    function getProfile() {
      profileService.getProfile().then(function(res) {
        vm.user = res.data;
      }).then(function() {
        return profileService.getCompany(vm.user.company);
      }).then(function(res) {
        vm.company = res.data;
      });
    };
  }
})(angular);
