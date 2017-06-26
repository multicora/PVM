describe('appHeader component', function() {
  'use strict';

  var componentController;
  var bindings;
  var location;
  var q;
  var rootScope;
  var storage;
  var notificationsService;
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
    notificationsService = {
      getNotifications: jasmine.createSpy('getNotifications'),
      markAsRead: jasmine.createSpy('markAsRead').and.callFake(function () {
        return q.resolve();
      }),
      messageGenerator: jasmine.createSpy('messageGenerator').and.callFake(function () {
        return q.resolve({
          data: [{
            id: '1',
            message: 'message',
            date: '0000-00-00 00:00:00',
            metadata: '{"email": "email"}'
          },
          {
            id: '2',
            message: 'message',
            date: '0000-00-00 00:00:00',
            metadata: '{"email": "email"}'
          }]
        });
      })
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
    notificationsService.getNotifications.and.callFake(function () {
      return q.resolve({
        data: [{
          id: '1',
          message: 'message',
          date: '0000-00-00 00:00:00',
          metadata: '{"email": "email"}'
        },
        {
          id: '2',
          message: 'message',
          date: '0000-00-00 00:00:00',
          metadata: '{"email": "email"}'
        }]
      });
    });

    var ctrl = componentController('appHeader', {
      notificationsService: notificationsService,
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

  describe('markAsRead', function() {
    it('should call notificationsService.markAsRead', function() {
      var id = 'id';
      notificationsService.getNotifications.and.callFake(function () {
        return q.resolve({
          data: [{
            id: '1',
            message: 'message',
            date: '0000-00-00 00:00:00',
            metadata: '{"email": "email"}'
          },
          {
            id: '2',
            message: 'message',
            date: '0000-00-00 00:00:00',
            metadata: '{"email": "email"}'
          }]
        });
      });
      var ctrl = componentController('appHeader', {
        notificationsService: notificationsService
      }, bindings);

      ctrl.markAsRead(id);
      expect(notificationsService.markAsRead).toHaveBeenCalled();
    });
  });
});
