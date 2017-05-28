describe('templateService', function() {
  var templateService;
  var httpBackend;

  beforeEach(module('app'));
  beforeEach(function() {
    inject(function($injector, $httpBackend) {
      templateService = $injector.get('templateService');
      httpBackend = $httpBackend;
    });
  });

  describe('getTemplate', function () {
    it('should send a request', function() {
      var id = 'id';
      var url = '/api/template/' + id;
      templateService.getTemplate(id);

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });

  describe('updateTemplate', function () {
    it('should send a request', function() {
      var id = 'id';
      var url = '/api/update-template';
      templateService.updateTemplate({});

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('createTemplate', function () {
    it('should send a request', function() {
      var id = 'id';
      var url = '/api/template';
      templateService.createTemplate({});

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });
});
