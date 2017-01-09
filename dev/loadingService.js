'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('loadingService', service);

  service.$inject = [];
  function service() {
    var count = 0;

    this.showSpinner = function () {
      // usSpinnerService.spin('loading-spinner');
      count++;
      console.log('Spinner show ' + count);
    };

    this.hideSpinner = function () {
      count--;

      if (count === 0) {
        // usSpinnerService.stop('loading-spinner');
        console.log('Spinner hide');
      }
    };
  }
})(angular);