describe('libraryService', function() {
  'use strict';
  var libraryService;
  var httpBackend;

  beforeEach(module('app'));
  beforeEach(function() {
    inject(function($injector, $httpBackend) {
      libraryService = $injector.get('libraryService');
      httpBackend = $httpBackend;
    });
  });

  describe('getVideos', function () {
    it('should send a request', function() {
      var url = '/api/videos';
      libraryService.getVideos({});

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });

  describe('getThumbnails', function () {
    it('should send a request', function() {
      var url = '/api/thumbnails';
      libraryService.getThumbnails({});

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });

  describe('getTemplates', function () {
    it('should send a request', function() {
      var url = '/api/templates';
      libraryService.getTemplates({});

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });

  describe('getConversations', function () {
    it('should send a request', function() {
      var url = '/api/conversations';
      libraryService.getConversations({});

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });

  describe('getConversationsToUser', function () {
    it('should send a request', function() {
      var url = '/api/conversations-to-user';
      libraryService.getConversationsToUser({});

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });

  describe('getFiles', function () {
    it('should send a request', function() {
      var url = '/api/files';
      libraryService.getFiles({});

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });

  describe('getFile', function () {
    it('should send a request', function() {
      var id = 'id';
      var url = '/api/file/' + id;
      libraryService.getFile(id);

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });

  describe('deleteTemplate', function () {
    it('should send a request', function() {
      var id = 'id';
      var url = '/api/delete-template';
      libraryService.deleteTemplate(id);

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('deleteVideo', function () {
    it('should send a request', function() {
      var id = 'id';
      var url = '/api/delete-video';
      libraryService.deleteVideo(id);

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('deleteFile', function () {
    it('should send a request', function() {
      var id = 'id';
      var url = '/api/delete-file';
      libraryService.deleteFile(id);

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('getEvents', function () {
    it('should send a request', function() {
      var url = '/api/events';
      libraryService.getEvents({});

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });
});
