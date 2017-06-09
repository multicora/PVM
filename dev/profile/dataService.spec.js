describe('profileService', function() {
  'use strict';
  var profileService;
  var httpBackend;

  beforeEach(module('app'));
  beforeEach(module(function ($provide) {
    $provide.value('$location', {
      path: jasmine.createSpy('path')
    });
  }));
  beforeEach(function() {
    inject(function($injector, $httpBackend) {
      profileService = $injector.get('profileService');
      httpBackend = $httpBackend;
    });
  });

  describe('getProfile', function () {
    it('should send a request', function() {
      var url = '/api/profile';
      profileService.getProfile();

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });

  describe('getProfilePhoto', function () {
    it('should send a request', function() {
      var id = 'id';
      var url = '/api/profile-photo/' + id;
      profileService.getProfilePhoto(id);

      httpBackend.expect('GET', url).respond({});

      httpBackend.flush();
    });
  });

  describe('getCompany', function () {
    it('should send a request', function() {
      var id = 'id';
      var url = '/api/company';
      profileService.getCompany(id);

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('updateProfile', function () {
    it('should send a request', function() {
      var user = 'user';
      var url = '/api/update-profile';
      profileService.updateProfile(user);

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('updateCompany', function () {
    it('should send a request', function() {
      var company = 'company';
      var url = '/api/update-company';
      profileService.updateCompany(company);

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('updatePhoto', function () {
    it('should send a request', function() {
      var photo = 'photo';
      var url = '/api/update-profile-photo';
      profileService.updatePhoto(photo);

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });

  describe('updateCompanyLogo', function () {
    it('should send a request', function() {
      var logo = 'logo';
      var company = 'company';
      var url = '/api/update-company-logo';
      profileService.updateCompanyLogo(logo, company);

      httpBackend.expect('POST', url).respond({});

      httpBackend.flush();
    });
  });
});
