describe('authCtrl', function() {
  'use strict';

  var $controller;
  var $q;
  var $rootScope;
  var $location;
  var authService;
  var tokenService;

  beforeEach(module('app'));
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _$location_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    $location = _$location_;

    authService = {
      loginConfirm: jasmine.createSpy('loginConfirm'),
      login: jasmine.createSpy('login'),
      register: jasmine.createSpy('register'),
      reset: jasmine.createSpy('reset'),
      setPassword: jasmine.createSpy('setPassword')
    };
    tokenService = {
      setToken: jasmine.createSpy('setToken').and.callFake(function () {
        return $q.resolve();
      })
    };
  }));

  describe('authenticate', function() {
    it('should call "location.path" with parametr "/" if $routeParams.confirmToken is not defined and authService.login response haven/`t error', function() {
      var scope = $rootScope.$new();
      var ctrl = $controller('authCtrl', {
        $scope: scope,
        authService: authService,
        tokenService: tokenService
      });
      var login;
      var password;

      authService.login.and.callFake(function () {
        return $q.resolve({data: {}});
      });

      ctrl.authenticate(login, password);
      scope.$apply();
      expect($location.path()).toBe('/');
    });
  });

  describe('register', function() {
    it('"errorRegister" should be "" and "selectedIndex" should be 0 if response haven/`t error', function() {
      var scope = $rootScope.$new();
      var ctrl = $controller('authCtrl', {
        $scope: scope,
        authService: authService,
        tokenService: tokenService
      });
      var email;
      var password;
      var confirmPassword;

      authService.register.and.callFake(function () {
        return $q.resolve({data: {}});
      });

      ctrl.register(email, password, confirmPassword);
      scope.$apply();
      expect(ctrl.errorRegister).toBe('');
      expect(ctrl.selectedIndex).toBe(0);
    });
  });

  describe('sendResetRequest', function() {
    it('should be defined "successMessage" and "errorMessage" should be "null" if response haven/`t error', function() {
      var scope = $rootScope.$new();
      var ctrl = $controller('authCtrl', {
        $scope: scope,
        authService: authService,
        tokenService: tokenService
      });
      var email;

      authService.reset.and.callFake(function () {
        return $q.resolve({data: {}});
      });

      ctrl.sendResetRequest(email);
      scope.$apply();
      expect(ctrl.errorMessage).toBe(null);
      expect(ctrl.successMessage).toBeTruthy();
    });

    it('should be defined "errorMessage" and "successMessage" should be "null" if response have error', function() {
      var scope = $rootScope.$new();
      var ctrl = $controller('authCtrl', {
        $scope: scope,
        authService: authService,
        tokenService: tokenService
      });
      var email;

      authService.reset.and.callFake(function () {
        return $q.resolve({data: {
          error: 'error',
          message: 'message'
        }});
      });

      ctrl.sendResetRequest(email);
      scope.$apply();
      expect(ctrl.errorMessage).toBeTruthy();
      expect(ctrl.successMessage).toBe(null);
    });
  });

  describe('setPassword', function() {
    it('should call "location.path" with parametr "/" if response haven/`t error', function() {
      var scope = $rootScope.$new();
      var ctrl = $controller('authCtrl', {
        $scope: scope,
        authService: authService,
        tokenService: tokenService
      });
      var newPassword;
      var confirmPassword;

      authService.setPassword.and.callFake(function () {
        return $q.resolve({data: {}});
      });

      ctrl.setPassword(newPassword, confirmPassword);
      scope.$apply();
      expect($location.path()).toBe('/');
    });

    it('should show error if response have error', function() {
      var scope = $rootScope.$new();

      authService.setPassword.and.callFake(function () {
        return $q.resolve({data: {
          error: 'error',
          message: 'message'
        }});
      });

      var ctrl = $controller('authCtrl', {
        $scope: scope,
        authService: authService,
        tokenService: tokenService
      });
      var newPassword;
      var confirmPassword;

      ctrl.setPassword(newPassword, confirmPassword);
      scope.$apply();
      expect(ctrl.errorMessage).toBeTruthy();
    });
  });
});
