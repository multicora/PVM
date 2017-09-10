describe('appHeader component', function() {
  'use strict';

  var componentController;
  var bindings;
  var location;
  var q;
  var rootScope;
  var storage;
  var profileService;

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
      clear: jasmine.createSpy('clear'),
      get: jasmine.createSpy('get')
    };
    profileService = {
      getProfile: jasmine.createSpy('getProfile').and.callFake(function () {
        return q.resolve({
          data: {}
        });
      })
    };
  }));

  it('should init component', function() {
    var scope = rootScope.$new();

    var ctrl = componentController('appHeader', {
      storage: storage,
      profileService: profileService
    }, bindings);

    scope.$apply();
    expect(ctrl).toBeDefined();
  });

  describe('redirect', function() {
    it('should redirect to "url/urlParam" if "urlParam" is defined', function() {
      var url = 'url';
      var urlParam = 'urlParam';
      var ctrl = componentController('appHeader', null, bindings);

      ctrl.redirect(url, urlParam);
      expect(location.path).toHaveBeenCalledWith(url + '/' + urlParam);
    });

    it('should redirect to "url" if "urlParam" isn/`t defined', function() {
      var url = 'url';
      var urlParam;
      var ctrl = componentController('appHeader', null, bindings);

      ctrl.redirect(url, urlParam);
      expect(location.path).toHaveBeenCalledWith(url);
    });
  });
});
