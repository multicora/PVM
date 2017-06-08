describe('tokenService', function() {
  'use strict';
  var tokenService;
  var localStorage;

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
      var name = 'name';

      tokenService.setToken(name, token);

      expect(localStorage.setItem).toHaveBeenCalledWith(name, token);
    });
  });

  // describe('getToken', function () {
  //   it('should get token', function() {
  //     var name = 'name';

  //     tokenService.getToken(name);
  //     expect(localStorage.getItem).toHaveBeenCalledWith(name);
  //   });
  // });

  // describe('clearToken', function () {
  //   it('should remove token', function() {
  //     var name = 'name';

  //     tokenService.clearToken(name);

  //     expect(localStorage.removeItem).toHaveBeenCalledWith(name);
  //   });
  // });
});
