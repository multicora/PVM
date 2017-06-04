describe('authCtrl', function() {
  'use strict';

  var $controller;
  var $q;
  var $rootScope;
  var $location;
  var authService;
  var tokenService;
  var dependency;
  var scope;
  var $routeParams;

  beforeEach(module('app'));
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;

    scope = $rootScope.$new();

    authService = {
      loginConfirm: jasmine.createSpy('loginConfirm'),
      login: jasmine.createSpy('login'),
      register: jasmine.createSpy('register'),
      reset: jasmine.createSpy('reset'),
      setPassword: jasmine.createSpy('setPassword')
    };

    $location = {
      path: jasmine.createSpy('path')
    };

    tokenService = {
      setToken: jasmine.createSpy('setToken').and.callFake(function () {
        return $q.resolve();
      })
    };

    $routeParams = {
      confirmToken: null
    };

    dependency = {
      $scope: scope,
      authService: authService,
      tokenService: tokenService,
      $location: $location,
      $routeParams: $routeParams
    };
  }));

  it('should lead to path "/" if confirmToken is set and correct', function () {
    $routeParams.confirmToken = 'confirmToken';
    authService.loginConfirm.and.returnValue($q.resolve({data: {}}));
    $controller('authCtrl', dependency);
    scope.$apply();

    expect($location.path).toHaveBeenCalledWith('/');
  });

  describe('authenticate', function() {
    it('should call "location.path" with parametr "/" if $routeParams.confirmToken is not defined and authService.login response haven\'t error', function() {
      var ctrl = $controller('authCtrl', dependency);

      authService.login.and.returnValue($q.resolve({data: {}}));

      ctrl.authenticate('login', 'password');
      scope.$apply();
      expect($location.path).toHaveBeenCalledWith('/');
    });
  });

  describe('register', function() {
    it('"errorRegister" should be "" and "selectedIndex" should be 0 if response haven\'t error', function() {
      var ctrl = $controller('authCtrl', dependency);

      authService.register.and.returnValue($q.resolve({data: {}}));

      ctrl.register('email', 'password', 'confirmPassword');
      scope.$apply();
      expect(ctrl.errorRegister).toBe('');
      expect(ctrl.selectedIndex).toBe(0);
    });
  });

  describe('sendResetRequest', function() {
    it('should be defined "successMessage" and "errorMessage" should be "null" if response haven\'t error', function() {
      var ctrl = $controller('authCtrl', dependency);

      authService.reset.and.returnValue($q.resolve({data: {}}));

      ctrl.sendResetRequest('email');
      scope.$apply();
      expect(ctrl.errorMessage).toBe(null);
      expect(ctrl.successMessage).toBeTruthy();
    });

    it('should be defined "errorMessage" and "successMessage" should be "null" if response have error', function() {
      var ctrl = $controller('authCtrl', dependency);

      authService.reset.and.returnValue($q.resolve({
        data: {
          error: 'error',
          message: 'message'
        }
      }));

      ctrl.sendResetRequest('email');
      scope.$apply();
      expect(ctrl.errorMessage).toBeTruthy();
      expect(ctrl.successMessage).toBe(null);
    });
  });

  describe('setPassword', function() {
    it('should call "location.path" with parametr "/" if response haven\'t error', function() {
      var ctrl = $controller('authCtrl', dependency);

      authService.setPassword.and.returnValue($q.resolve({data: {}}));

      ctrl.setPassword('newPassword', 'confirmPassword');
      scope.$apply();
      expect($location.path).toHaveBeenCalledWith('/');
    });

    it('should show error if response have error', function() {
      authService.setPassword.and.returnValue($q.resolve({
        data: {
          error: 'error',
          message: 'message'
        }
      }));

      var ctrl = $controller('authCtrl', dependency);
      var newPassword;
      var confirmPassword;

      ctrl.setPassword(newPassword, confirmPassword);
      scope.$apply();
      expect(ctrl.errorMessage).toBeTruthy();
    });
  });
});
