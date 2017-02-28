(function (angular) {
  var app = angular.module('app');

  app.controller('templateCtrl', ctrl);

  ctrl.$inject = ['$routeParams', 'conversationsService'];
  function ctrl($routeParams, conversationsService) {
    var vm = this;

  }
})(angular);