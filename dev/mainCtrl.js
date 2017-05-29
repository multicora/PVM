(function (angular) {
  'use strict';
  var app = angular.module('app');

  app.controller('mainCtrl', ctrl);

  ctrl.$inject = [
    '$rootScope',
    '$location',
    '$scope',
    'ga'
  ];
  function ctrl(
    $rootScope,
    $location,
    $scope,
    ga
  ) {
    $scope.redirect = function(url, urlParam) {
      if (urlParam) {
        return $location.path(url + '/' + urlParam);
      } else {
        return $location.path(url);
      }
    };

    $rootScope.$on('$routeChangeStart', function (e, next) {
      ga.send('pageview', next.originalPath);
    });
  }
})(angular);
