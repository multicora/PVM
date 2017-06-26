describe('storage', function() {
  'use strict';
  var storage;
  var localStorage;
  var name = 'biz.authToken';

  beforeEach(module('app'));
  beforeEach(module(function ($provide) {
    $provide.value('$localStorage', {});
  }));
  beforeEach(function() {
    inject(function($injector, $localStorage) {
      storage = $injector.get('storage');
      localStorage = $localStorage;
    });
  });

  describe('setToken', function () {
    it('should set token', function() {
      var token = 'token';

      storage.set(name, token);

      expect(localStorage[name]).toBe(token);
    });
  });

  describe('getToken', function () {
    it('should get token', function() {
      var token = 'token';
      var result;

      storage.set(name, token);
      result = storage.get(name);
      expect(result).toBe(token);
    });
  });

  describe('clearToken', function () {
    it('should remove token', function() {
      storage.clear(name);

      expect(localStorage.name).toBe(undefined);
    });
  });
});
