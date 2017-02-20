(function (angular) {
  var app = angular.module('app');

  app.controller('profileCtrl', ctrl);

  ctrl.$inject = ['profileService'];
  function ctrl(profileService) {
    var vm = this;

  }
})(angular);