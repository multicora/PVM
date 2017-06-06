describe('authService', function() {
  'use strict';
  var authService;
  var httpBackend;
  var location;

  beforeEach(module('app'));
  beforeEach(module(function ($provide) {
    $provide.value('$location', {
      path: jasmine.createSpy('path')
    });
  }));
  beforeEach(function() {
    inject(function($injector, $httpBackend, $location) {
      authService = $injector.get('authService');
      httpBackend = $httpBackend;
      location = $location;
    });
  });

  describe('login', function () {
    it('should send a request', function() {
      var url = '/api/login';
      authService.login();

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('loginConfirm', function () {
    it('should send a request', function() {
      var url = '/api/confirm-email';
      authService.loginConfirm();

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('resendConfirmMail', function () {
    it('should send a request', function() {
      var url = '/api/resend-confirm-mail';
      authService.resendConfirmMail();

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('reset', function () {
    it('should send a request', function() {
      var url = 'api/reset-password';
      authService.reset();

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('register', function () {
    it('should send a request', function() {
      var url = 'api/register';
      authService.register();

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('setPassword', function () {
    it('should send a request', function() {
      var url = 'api/new-password';
      authService.setPassword();

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('getCurrentUser', function () {
    it('should send a request', function() {
      var url = 'api/currentUser';
      authService.getCurrentUser();

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });

  describe('getRoles', function () {
    it('should send a request', function() {
      var url = 'api/roles';
      authService.getRoles();

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });

  describe('redirectByRole', function () {
    it('should redirect to "/admin" if roles contain role with "name" "admin"', function() {
      var roles = [
        {
          name: 'admin'
        }
      ];

      authService.redirectByRole(roles);

      expect(location.path).toHaveBeenCalledWith('/admin');
    });

      it('should redirect to "/" if roles dosen\'t contain role with "name" "admin"', function() {
      var roles = [
        {
          name: 'user'
        }
      ];

      location.path.and.returnValue({
        search: jasmine.createSpy('search')
      });
      authService.redirectByRole(roles);

      expect(location.path).toHaveBeenCalledWith('/');
    });
  });
});
