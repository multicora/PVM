describe('authCtrl', function() {
  'use strict';

  var $controller;
  var $q;
  var $rootScope;
  var $location;
  var authService;
  var storage;
  var dependency;
  var scope;
  var $routeParams;

  beforeEach(module('app'));
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;

    scope = $rootScope.$new();

    authService = {
      loginConfirm: jasmine.createSpy('loginConfirm'),
      reset: jasmine.createSpy('reset'),
      setPassword: jasmine.createSpy('setPassword')
    };

    $location = {
      path: jasmine.createSpy('path')
    };

    storage = {
      set: jasmine.createSpy('set').and.callFake(function () {
        return $q.resolve();
      })
    };

    $routeParams = {
      confirmToken: null
    };

    dependency = {
      $scope: scope,
      $location: $location,
      $routeParams: $routeParams,
      authService: authService,
      storage: storage
    };
  }));

  // it('should lead to path "/" if confirmToken is set and correct', function () {
  //   $routeParams.confirmToken = 'confirmToken';
  //   var ctrl = $controller('authCtrl', dependency);

  //   authService.loginConfirm.and.callFake(function() {
  //     return $q.resolve({data: {}});
  //   });
  //   scope.$apply();

  //   expect($location.path).toHaveBeenCalledWith('/');
  // });

  describe('sendResetRequest', function() {
    it('should be defined "successMessage" and "errorMessage" should be "null" if response haven\'t error', function() {
      var ctrl = $controller('authCtrl', dependency);

      authService.reset.and.returnValue($q.resolve({data: {}}));

      ctrl.sendResetRequest('email');
      scope.$apply();
      expect(ctrl.errorMessage).toBe(null);
      expect(ctrl.successMessage).toBeTruthy();
    });

    // it('should be defined "errorMessage" and "successMessage" should be "null" if response have error', function() {
    //   var ctrl = $controller('authCtrl', dependency);

    //   authService.reset.and.returnValue($q.resolve({
    //     data: {
    //       error: 'error',
    //       message: 'message'
    //     }
    //   }));

    //   ctrl.sendResetRequest('email');
    //   scope.$apply();
    //   expect(ctrl.errorMessage).toBeTruthy();
    //   expect(ctrl.successMessage).toBe(null);
    // });
  });

  // describe('setPassword', function() {
  //   it('should call "location.path" with parametr "/" if response haven\'t error', function() {
  //     var ctrl = $controller('authCtrl', dependency);

  //     authService.setPassword.and.returnValue($q.resolve({data: {}}));

  //     ctrl.setPassword('newPassword', 'confirmPassword');
  //     scope.$apply();
  //     expect($location.path).toHaveBeenCalledWith('/');
  //   });

  //   it('should show error if response have error', function() {
  //     authService.setPassword.and.returnValue($q.reject({
  //       data: {
  //         error: 'error',
  //         message: 'message'
  //       }
  //     }));

  //     var ctrl = $controller('authCtrl', dependency);
  //     var newPassword;
  //     var confirmPassword;

  //     ctrl.setPassword(newPassword, confirmPassword);
  //     scope.$apply();
  //     expect(ctrl.errorMessage).toBeTruthy();
  //   });
  // });
});
