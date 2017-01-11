'use strict';
(function (angular) {
  var app = angular.module('app');

  app.config(config);

  config.$inject = ['$routeProvider', '$httpProvider'];
  function config($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('interseptor');

    $routeProvider.when('/login', {
      controller: 'authCtrl',
      controllerAs: 'vm',
      templateUrl: 'auth/login.html'
    }).when('/reset-password', {
      controller: 'authCtrl',
      controllerAs: 'vm',
      templateUrl: 'auth/resetTpl.html'
    }).when('/new-password/:token', {
      controller: 'authCtrl',
      controllerAs: 'vm',
      templateUrl: 'auth/newPassword.html'
    }).when('/library', {
      controller: 'libraryCtrl',
      controllerAs: 'vm',
      templateUrl: 'library/tpl.html'
    }).when('/conversation/:id', {
      controller: 'conversationCtrl',
      controllerAs: 'vm',
      templateUrl: 'conversations/tpl.html'
    }).when('/users', {
      controller: 'usersCtrl',
      controllerAs: 'vm',
      templateUrl: 'users/tpl.html'
    }).when('/user/:id', {
      controller: 'editUserCtrl',
      controllerAs: 'vm',
      templateUrl: 'editUser/tpl.html'
    }).when('/', {
      redirectTo: '/library'
    }).otherwise({ redirectTo: '/' });
  }
})(angular);