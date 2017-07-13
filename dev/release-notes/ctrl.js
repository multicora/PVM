(function (angular) {
  'use strict';
  var app = angular.module('app');

  app.controller('releaseNotesCtrl', ctrl);

  ctrl.$inject = [
  ];
  function ctrl(
  ) {
    var vm = this;

    // Should be reworked for geting releases from backend
    vm.releases = [
      {
        date: '1/2/2017',
        version: '0.0.2a',
        notes: [
          'test1',
          'test2'
        ]
      }
    ];
  }
})(angular);
