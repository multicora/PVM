describe('appHeader component', function() {
  'use strict';

  var componentController;
  var bindings;
  var location;
  var q;
  var rootScope;
  var tokenService;
  var notificationsService;

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
    tokenService = {
      clearToken: jasmine.createSpy('clearToken'),
      getToken: jasmine.createSpy('getToken')
    };
    notificationsService = {
      getNotifications: jasmine.createSpy('getNotifications')
    };
  }));

  it('should init component', function() {
    var scope = rootScope.$new();
    var ctrl = componentController('appHeader', {
      notificationsService: notificationsService,
      tokenService: tokenService
    }, bindings);

    notificationsService.getNotifications.and.callFake(function () {
      return q.resolve({
        data: [{
          id: '',
          message: '',
          date: ''
        }]
      });
    });

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
