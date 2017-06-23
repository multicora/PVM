describe('appMenu component', function() {
  'use strict';

  var componentController;
  var bindings;
  var location;
  var tokenService;

  beforeEach(module('app'));
  beforeEach(module(function ($provide) {
    $provide.value('$location', {
      path: jasmine.createSpy('path')
    });
  }));
  beforeEach(inject(function($componentController, $location) {
    componentController = $componentController;
    location = $location;
    bindings = {};
    tokenService = {
      clearToken: jasmine.createSpy('clearToken'),
      getToken: jasmine.createSpy('getToken')
    };
  }));

  describe('redirect', function() {
    it('should redirect to "url/urlParam" if "urlParam" is defined', function() {
      var url = 'url';
      var urlParam = 'urlParam';
      var ctrl = componentController('appMenu', null, bindings);

      ctrl.redirect(url, urlParam);
      expect(location.path).toHaveBeenCalledWith(url + '/' + urlParam);
    });

    it('should redirect to "url" if "urlParam" isn/`t defined', function() {
      var url = 'url';
      var urlParam;
      var ctrl = componentController('appMenu', null, bindings);

      ctrl.redirect(url, urlParam);
      expect(location.path).toHaveBeenCalledWith(url);
    });
  });

  describe('invalidateSession', function() {
    it('should call "tokenService.clearToken" and redirect to "/login"', function() {
      var ctrl = componentController('appHeader', {
        tokenService: tokenService
      }, bindings);

      ctrl.invalidateSession();
      expect(location.path).toHaveBeenCalledWith('/login');
      expect(tokenService.clearToken).toHaveBeenCalled();
    });
  });
});
