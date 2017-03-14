'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('loadingService', service);

  service.$inject = [];
  function service() {
    var count = 0;
    var spinner = document.getElementById('spinner');

    this.showSpinner = function () {
      count++;
      spinner.classList.remove('hidden');
    };

    this.hideSpinner = function () {
      count--;

      if (count === 0) {
        spinner.classList.add('hidden');
      }
    };
  }
})(angular);