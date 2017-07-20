(function (angular) {
  'use strict';
  var app = angular.module('app');

  app.controller('releaseNotesCtrl', ctrl);

  ctrl.$inject = [
    'releaseNotesService'
  ];
  function ctrl(
    releaseNotesService
  ) {
    var vm = this;

    // Should be reworked for geting releases from backend
    vm.releases = releaseNotesService.get();
  }
})(angular);
