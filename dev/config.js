'use strict';
(function (angular) {
  var app = angular.module('app');

  app.config(config);

  config.$inject = [
    '$routeProvider',
    '$httpProvider',
    '$locationProvider',
    'resolverProvider'
  ];
  function config(
    $routeProvider,
    $httpProvider,
    $locationProvider,
    resolverProvider
  ) {
    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push('interseptor');
    var resolver = resolverProvider.$get();

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
    }).when('/register', {
      controller: 'authCtrl',
      controllerAs: 'vm',
      templateUrl: 'auth/register.html'
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
      templateUrl: 'users/tpl.html',
      resolve: {
        resolver: resolver.get('SEE_ADMIN_PAGE', /^\/admin\/users/)
      }
    }).when('/user/:id', {
      controller: 'editUserCtrl',
      controllerAs: 'vm',
      templateUrl: 'editUser/tpl.html',
      resolve: {
        resolver: resolver.get('SEE_ADMIN_PAGE', /^\/admin\/use\/[a-zA-Z-0-9]+/)
      }
    }).when('/profile', {
      controller: 'profileCtrl',
      controllerAs: 'vm',
      templateUrl: 'profile/tpl.html'
    }).when('/template/:videoId', {
      controller: 'templateCtrl',
      controllerAs: 'vm',
      templateUrl: 'template/tpl.html'
    }).when('/template-edit/:templateId', {
      controller: 'templateEditCtrl',
      controllerAs: 'vm',
      templateUrl: 'template/tpl.html'
    }).when('/', {
      redirectTo: '/library'
    }).otherwise({ redirectTo: '/' });
  }
})(angular);