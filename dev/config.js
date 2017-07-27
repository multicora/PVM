(function (angular) {
  'use strict';
  var app = angular.module('app');

  app.config(config);

  config.$inject = [
    '$routeProvider',
    '$httpProvider',
    '$locationProvider',
    'resolverProvider',
    'RollbarProvider'
  ];
  function config(
    $routeProvider,
    $httpProvider,
    $locationProvider,
    resolverProvider,
    RollbarProvider
  ) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    registerRollbar(RollbarProvider);

    $httpProvider.interceptors.push('interseptor');
    var resolver = resolverProvider.$get();

    $routeProvider.when('/login', {
      controller: 'authCtrl',
      controllerAs: 'vm',
      templateUrl: 'auth/login.html'
    }).when('/login/:confirmToken', {
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
    }).when('/conversations', {
      controller: 'conversationsCtrl',
      controllerAs: 'vm',
      templateUrl: 'conversations/tpl.html'
    }).when('/dashboard', {
      controller: 'dashboardCtrl',
      controllerAs: 'vm',
      templateUrl: 'dashboard/tpl.html'
    }).when('/library', {
      controller: 'libraryCtrl',
      controllerAs: 'vm',
      templateUrl: 'library/tpl.html',
      resolve: {
        tokenChecker: resolver.tokenChecker()
      }
    }).when('/conversation/:id', {
      controller: 'conversationCtrl',
      controllerAs: 'vm',
      templateUrl: 'conversation/tpl.html'
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
    }).when('/template/:templateId?', {
      controller: 'templateCtrl',
      controllerAs: 'vm',
      templateUrl: 'template/tpl.html'
    }).when('/', {
      redirectTo: '/library'
    }).otherwise({ redirectTo: '/' });
  }


  function registerRollbar(RollbarProvider) {
    if (getEnvironment(location) !== 'develop') {
      RollbarProvider.init({
        accessToken: 'f4b32574bf5047cdad7c4e1d8ecc7209',
        captureUncaught: true,
        payload: {
          environment: getEnvironment(location)
        }
      });
    }
  }

  function getEnvironment(location) {
    return location.hostname === 'localhost' ? 'develop' : 'production';
  }
})(angular);
