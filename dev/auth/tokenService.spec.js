describe('tokenService', function() {
  'use strict';
  var tokenService;
  var localStorage;
  var name = 'biz.authToken';

  beforeEach(module('app'));
  beforeEach(module(function ($provide) {
    $provide.value('$localStorage', {});
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

      expect(localStorage[name]).toBe(token);
    });
  });

  describe('getToken', function () {
    it('should get token', function() {
      var token = 'token';
      var result;

      tokenService.setToken(token);
      result = tokenService.getToken();
      expect(result).toBe(token);
    });
  });

  describe('clearToken', function () {
    it('should remove token', function() {
      tokenService.clearToken();

      expect(localStorage.name).toBe(undefined);
    });
  });
});
