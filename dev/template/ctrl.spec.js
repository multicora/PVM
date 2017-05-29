describe('templateCtrl', function() {

  var $controller;
  var $q;
  var $rootScope;
  var conversationsService = {
    create: jasmine.createSpy('create'),
    createPublic: jasmine.createSpy('createPublic'),
    getVideo: jasmine.createSpy('getVideo'),
  };
  var libraryService = {
    getVideos: jasmine.createSpy('getVideos'),
  };
  var filesService = {
    getFiles: jasmine.createSpy('getFiles'),
  };
  var templateService = {
    getTemplate: jasmine.createSpy('getTemplate'),
    createTemplate: jasmine.createSpy('createTemplate'),
    updateTemplate: jasmine.createSpy('updateTemplate'),
  };
  var uploadRecordPopupService = {
    showUploadPopup: jasmine.createSpy('showUploadPopup'),
    showRecordPopup: jasmine.createSpy('showRecordPopup'),
  };
  var uploadService = {};

  beforeEach(module('app'));
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  describe('getTemplate', function() {
    it('should get template if "$routeParams.templateId" ', function() {
      var scope = $rootScope.$new();

      templateService.getTemplate.and.callFake(function () {
        return $q.resolve({
          data: []
        });
      });
      filesService.getFiles.and.callFake(function () {
        return $q.resolve({
          data: [{
            name: 1
          }, {
            name: 3
          }, {
            name: 2
          }]
        });
      });

      var ctrl = $controller('templateCtrl', {
        $scope: scope,
        templateService: templateService,
        filesService: filesService,
      });

      scope.$apply();
  //     expect(ctrl.messages).toBeTruthy();
    });

    it('should get video if "$routeParams.video" ', function() {
      var scope = $rootScope.$new();

      conversationsService.getVideo.and.callFake(function () {
        return $q.resolve({
          data: []
        });
      });

      var ctrl = $controller('templateCtrl', {
        $scope: scope,
        conversationsService: conversationsService,
      });

      scope.$apply();
  //     expect(ctrl.messages).toBeTruthy();
    });
  });

  // TODO: test message sorting

  function getDependency() {
    return {
      uploadRecordPopupService: uploadRecordPopupService,
      conversationsService: conversationsService,
      uploadService: uploadService,
      libraryService: libraryService,
      templateService: templateService,
      filesService: filesService,
    };
  }
});