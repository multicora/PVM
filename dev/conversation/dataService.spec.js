describe('conversationsService', function() {
  'use strict';
  var conversationsService;
  var httpBackend;

  beforeEach(module('app'));
  beforeEach(function() {
    inject(function($injector, $httpBackend) {
      conversationsService = $injector.get('conversationsService');
      httpBackend = $httpBackend;
    });
  });

  describe('create', function () {
    it('should send a request', function() {
      var url = '/api/conversations';
      conversationsService.create({});

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('createPublic', function () {
    it('should send a request', function() {
      var url = '/api/conversations-public';
      conversationsService.createPublic({});

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('get', function () {
    it('should send a request', function() {
      var id = 'id';
      var url = '/api/conversations/' + id;
      conversationsService.get(id);

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });

  describe('getByAuthor', function () {
    it('should send a request', function() {
      var url = '/api/conversations';
      conversationsService.getByAuthor({});

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });

  describe('getVideo', function () {
    it('should send a request', function() {
      var id = 'id';
      var url = '/api/videos/' + id;
      conversationsService.getVideo(id);

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });

  describe('getChat', function () {
    it('should send a request', function() {
      var id = 'id';
      var url = '/api/chat/' + id;
      conversationsService.getChat(id);

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });

  describe('videoWatched', function () {
    it('should send a request', function() {
      var url = '/api/video-watched';
      conversationsService.videoWatched();

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('videoIsWatching', function () {
    it('should send a request', function() {
      var url = '/api/video-is-watching';
      conversationsService.videoIsWatching();

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('fileDownloaded', function () {
    it('should send a request', function() {
      var url = '/api/file-downloaded';
      conversationsService.fileDownloaded({});

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('getChatForDashboard', function () {
    it('should send a request', function() {
      var url = '/api/chat-for-dashboard';
      conversationsService.getChatForDashboard();

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });

});
