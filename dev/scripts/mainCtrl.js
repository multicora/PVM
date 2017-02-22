(function (angular) {
  var app = angular.module('app');

  app.controller('mainCtrl', ctrl);

  ctrl.$inject = ['$scope', '$location'];
  function ctrl($scope, $location) {
    var vm = this;

    $scope.redirect = function(url, urlParam) {
      if (urlParam) {
        return $location.path(url + '/' + urlParam);
      } else {
        return $location.path(url);
      }
    }
  }
})(angular);