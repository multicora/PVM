describe('libraryCtrl', function() {
  'use strict';

  var $controller;
  var $q;
  var $rootScope;
  var libraryService = {
    getVideos: jasmine.createSpy('getVideos'),
    getTemplates: jasmine.createSpy('getTemplates'),
    getEvents: jasmine.createSpy('getEvents')
  };
  var filesService = {
    getFiles: jasmine.createSpy('getFiles')
  };

  beforeEach(module('app'));
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  describe('initial phase', function() {
    it('should get the videos, templates, files', function() {
      var scope = $rootScope.$new();

      libraryService.getVideos.and.callFake(function () {
        return $q.resolve({
          data: []
        });
      });

      filesService.getFiles.and.callFake(function () {
        return $q.resolve({});
      });

      libraryService.getTemplates.and.callFake(function () {
        return $q.resolve({
          data: []
        });
      });

      var ctrl = $controller('libraryCtrl', {
        $scope: scope,
        libraryService: libraryService,
        filesService: filesService
      });

      scope.$apply();
      expect(ctrl.templatesList).toBeTruthy();
      expect(ctrl.filesList).toBeTruthy();
      expect(ctrl.videosList).toBeTruthy();
    });
  });
});
