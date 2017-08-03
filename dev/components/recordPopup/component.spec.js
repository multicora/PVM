describe('recordPopup component', function() {
  'use strict';

  var componentController;
  var bindings;
  var location;
  var q;
  var uploadService;
  var rootScope;
  var uploadRecordPopupService;

  beforeEach(module('app'));
  beforeEach(module(function ($provide) {
    $provide.value('$location', {
      path: jasmine.createSpy('path'),
      url: jasmine.createSpy('url')
    });
  }));
  beforeEach(inject(function($componentController, $location, $q, $rootScope) {
    componentController = $componentController;
    location = $location;
    rootScope = $rootScope;
    q = $q;
    bindings = {};
    uploadService = {
      sendFile: jasmine.createSpy('sendFile').and.returnValue(q.resolve({data: {id: 'id'}}))
    };
    uploadRecordPopupService = {
      hideRecordPopup: jasmine.createSpy('hideRecordPopup')
    };
  }));

  describe('close record popup', function() {
    it('should call uploadRecordPopupService.hideRecordPopup', function() {
      var ctrl = componentController('recordPopup', {
        uploadRecordPopupService: uploadRecordPopupService
      }, bindings);

      ctrl.closeRecordPopup();
      expect(uploadRecordPopupService.hideRecordPopup).toHaveBeenCalled();
    });
  });

  describe('finish record', function() {
    it('should define recordedData', function() {
      var data = 'data';
      var ctrl = componentController('recordPopup', null, bindings);

      ctrl.finishRecord(data);
      expect(ctrl.recordedData).toBeTruthy();
    });
  });

  describe('send record click', function() {
    it('should redirect to `template/?video=` + id', function() {
      var scope = rootScope.$new();
      var name = 'name';
      var ctrl = componentController('recordPopup', {
        uploadService: uploadService
      }, bindings);
      ctrl.recordedData = {
        video: 'video'
      };

      ctrl.sendRecordClick(name);
      scope.$apply();
      expect(location.path).toHaveBeenCalledWith('template/?video=id');
    });
  });

  describe('save record click', function() {
    it('should call ctrl.closeRecordPopup && ctrl.getVideos, ctrl.videoName shuld be equal `null`', function() {
      var scope = rootScope.$new();
      var name = 'name';
      var ctrl = componentController('recordPopup', {
        uploadService: uploadService,
        uploadRecordPopupService: uploadRecordPopupService
      }, bindings);

      ctrl.getVideos = jasmine.createSpy('getVideos');
      ctrl.closeRecordPopup = jasmine.createSpy('closeRecordPopup');

      ctrl.recordedData = {
        video: 'video'
      };

      ctrl.saveRecordClick(name);
      scope.$apply();
      expect(ctrl.closeRecordPopup).toHaveBeenCalled();
      expect(ctrl.getVideos).toHaveBeenCalled();
      expect(ctrl.videoName).toBe(null);
    });
  });
});
