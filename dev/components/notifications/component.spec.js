describe('notifications component', function() {
  'use strict';

  var componentController;
  var bindings;
  var location;
  var q;
  var rootScope;
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

    var ctrl = componentController('notifications', {
      notificationsService: notificationsService
    }, bindings);


    scope.$apply();
    expect(ctrl).toBeDefined();
  });

  describe('openConversation', function() {
    it('should call notificationsService.markAsRead && redirect to conversation', function() {
      var notificationId = 'id';
      var conversationId = 'id';
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
      var ctrl = componentController('notifications', {
        notificationsService: notificationsService
      }, bindings);

      ctrl.openConversation(conversationId, notificationId);
      expect(notificationsService.markAsRead).toHaveBeenCalled();
      expect(location.path).toHaveBeenCalledWith('conversation/' + conversationId);
    });
  });

  describe('onClose', function() {
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
      var ctrl = componentController('notifications', {
        notificationsService: notificationsService
      }, bindings);

      ctrl.onClose(id);
      expect(notificationsService.markAsRead).toHaveBeenCalled();
    });
  });
});
