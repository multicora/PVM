describe('appMenu component', function() {
  'use strict';

  var componentController;
  var bindings;
  var location;
  var storage;

  beforeEach(module('app'));
  beforeEach(module(function ($provide) {
    $provide.value('$location', {
      path: jasmine.createSpy('path'),
      url: jasmine.createSpy('url')
    });
  }));
  beforeEach(inject(function($componentController, $location) {
    componentController = $componentController;
    location = $location;
    bindings = {};
    storage = {
      clear: jasmine.createSpy('clear'),
      get: jasmine.createSpy('get')
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
    it('should call "storage.clear" and redirect to "/login"', function() {
      var ctrl = componentController('appMenu', {
        storage: storage
      }, bindings);

      ctrl.invalidateSession();
      expect(location.path).toHaveBeenCalledWith('/login');
      expect(storage.clear).toHaveBeenCalled();
    });
  });
});
