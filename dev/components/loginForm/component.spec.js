describe('loginForm component', function() {
  'use strict';

  var componentController;
  var bindings;
  var location;
  var q;
  var rootScope;
  var storage;
  var authService;

  beforeEach(module('app'));
  beforeEach(module(function ($provide) {
    $provide.value('$location', {
      path: jasmine.createSpy('path')
    });
  }));

  beforeEach(inject(function($componentController, $location, $q, $rootScope) {
    componentController = $componentController;
    location = $location;
    rootScope = $rootScope;
    q = $q;
    bindings = {};
    storage = {
      set: jasmine.createSpy('clear')
    };

    authService = {
      login: jasmine.createSpy('login'),
      register: jasmine.createSpy('register')
    };
  }));

  describe('authenticate', function() {
    it('should call onSuccessLogin if $routeParams.confirmToken is not defined and authService.login response haven\'t error', function() {
      var scope = rootScope.$new();
      var ctrl = componentController('loginForm', {
        authService: authService,
        storage: storage,
        location: location
      }, bindings);

      ctrl.onSuccessLogin = jasmine.createSpy('onSuccessLogin');
      authService.login.and.returnValue(q.resolve({data: {}}));

      ctrl.authenticate('login', 'password');
      scope.$apply();
      expect(ctrl.onSuccessLogin).toHaveBeenCalled();
    });
  });

  describe('register', function() {
    it('"errorRegister" should be "" and "selectedIndex" should be 0 if response haven\'t error', function() {
      var scope = rootScope.$new();
      var ctrl = componentController('loginForm', {
        authService: authService,
        storage: storage,
        location: location
      }, bindings);

      authService.register.and.returnValue(q.resolve({data: {}}));

      ctrl.register('email', 'password', 'confirmPassword');
      scope.$apply();
      expect(ctrl.errorRegister).toBe('');
      expect(ctrl.selectedIndex).toBe(0);
    });

    it('"errorRegister" should be defined if response have error', function() {
      var scope = rootScope.$new();
      var ctrl = componentController('loginForm', {
        authService: authService,
        storage: storage,
        location: location
      }, bindings);

      authService.register.and.returnValue(q.reject({
        data: {
          error: 'error',
          message: 'message'
        }
      }));

      ctrl.register('email', 'password', 'confirmPassword');
      scope.$apply();
      expect(ctrl.errorRegister).toBeTruthy();
    });
  });

  describe('forgotPassword', function() {
    it('should call "location.path" with parametr "/reset-password"', function() {
      var ctrl = componentController('loginForm', {
        location: location
      }, bindings);

      ctrl.forgotPassword();
      expect(location.path).toHaveBeenCalledWith('/reset-password');
    });
  });
});
