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

    vm.showFeedbackPopup = false;
    vm.photoError = '';
    vm.logoError = '';
    vm.user = null;
    vm.company = null;

    getProfile().then(function () {
      return getCompany(vm.user.company);
    });

    vm.save = function() {
      vm.company.name = vm.company.name || '';
      vm.user.companyPosition = vm.user.companyPosition || '';
      vm.user.firstName = vm.user.firstName || '';
      vm.user.secondName = vm.user.secondName || '';
      vm.user.phone = vm.user.phone || '';
      vm.user.photo = vm.user.photo || '';

      profileService.updateProfile(vm.user).then(function() {
        profileService.updateCompany(vm.company);
      }).then(function() {
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
    };

    vm.showFeedback = function () {
      vm.showFeedbackPopup = true;
    };

    vm.closeFeedback = function () {
      vm.showFeedbackPopup = false;
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
      return profileService.getProfile().then(function(res) {
        vm.user = res.data;
      }).catch(function () {
        vm.user = null;
      });
    };

    function getCompany(id) {
      return profileService.getCompany(id).then(function(res) {
        vm.company = res.data || {};
        vm.company.name = vm.company.name || '';
      }).catch(function () {
        vm.company = null;
      });
    };
  }
})(angular);
