describe('tokenService', function() {
  'use strict';
  var tokenService;
  var localStorage;
  var name = 'biz.authToken';

  beforeEach(module('app'));
  beforeEach(module(function ($provide) {
    $provide.value('$localStorage', {
      getItem: jasmine.createSpy('getItem'),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem')
    });
  }));
  beforeEach(function() {
    inject(function($injector, $localStorage) {
      tokenService = $injector.get('tokenService');
      localStorage = $localStorage;
    });
  });

  describe('setToken', function () {
    it('should set token', function() {
      var token = 'token';

      tokenService.setToken(token);

      expect(localStorage.setItem).toHaveBeenCalledWith(name, token);
    });
  });

  describe('getToken', function () {
    it('should get token', function() {

      tokenService.getToken();
      expect(localStorage.getItem).toHaveBeenCalledWith(name);
    });
  });

  describe('clearToken', function () {
    it('should remove token', function() {
      tokenService.clearToken();

      expect(localStorage.removeItem).toHaveBeenCalledWith(name);
    });
  });
});
