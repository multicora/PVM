describe('notificationsService', function() {
  'use strict';
  var notificationsService;
  var httpBackend;

  beforeEach(module('app'));
  beforeEach(function() {
    inject(function($injector, $httpBackend) {
      notificationsService = $injector.get('notificationsService');
      httpBackend = $httpBackend;
    });
  });

  describe('getNotifications', function () {
    it('should send a request', function() {
      var url = '/api/notifications';
      notificationsService.getNotifications();

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });

  describe('markAsRead', function () {
    it('should send a request', function() {
      var id = 'id';
      var url = '/api/notification-read/' + id;
      notificationsService.markAsRead(id);

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });
});
