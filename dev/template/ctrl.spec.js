describe('templateCtrl', function() {

  var $controller;
  var $q;
  var $rootScope;
  var $routeParams;
  var conversationsService;
  var libraryService;
  var filesService;
  var profileService;
  var templateService;
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

    $routeParams = {};
    templateService = {
      getTemplate: jasmine.createSpy('getTemplate'),
      createTemplate: jasmine.createSpy('createTemplate'),
      updateTemplate: jasmine.createSpy('updateTemplate'),
    };
    libraryService = {
      getVideos: jasmine.createSpy('getVideos').and.callFake(function () {
        return $q.resolve({data:[]});
      })
    };
    conversationsService = {
      create: jasmine.createSpy('create'),
      createPublic: jasmine.createSpy('createPublic'),
      getVideo: jasmine.createSpy('getVideo').and.callFake(function () {
        return $q.resolve({
          data: {
            attributes: {
              url:''
            }
          }
        });
      }),
    };
    profileService = {
      getProfile: jasmine.createSpy('getProfile').and.callFake(function () {
        return $q.resolve({data:[]});
      }),
    };
    filesService = {
      getFiles: jasmine.createSpy('getFiles').and.callFake(function () {
        return $q.resolve({
          data: [{
            name: 1
          }, {
            name: 3
          }, {
            name: 2
          }]
        });
      }),
    };
  }));

  it('should be defined', function() {
    var scope = $rootScope.$new();

    templateService.getTemplate.and.callFake(function () {
      return $q.resolve({
        data: []
      });
    });

    var ctrl = $controller('templateCtrl', {
      $scope: scope,
      templateService: templateService,
      libraryService: libraryService,
      filesService: filesService,
      conversationsService: conversationsService,
      profileService: profileService,
    });

    scope.$apply();

    expect(ctrl).toBeDefined();
  });

  describe('getVideos', function() {
    it('should set "vm.videoList"', function() {
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
        libraryService: libraryService,
        filesService: filesService,
        conversationsService: conversationsService,
        profileService: profileService,
      });

      scope.$apply();
      expect(ctrl.videoList).toBeDefined();
    });

  //   it('should get video if "$routeParams.video" ', function() {
  //     var scope = $rootScope.$new();

  //     conversationsService.getVideo.and.callFake(function () {
  //       return $q.resolve({
  //         data: []
  //       });
  //     });

  //     var ctrl = $controller('templateCtrl', {
  //       $scope: scope,
  //       conversationsService: conversationsService,
  //     });

  //     scope.$apply();
  // //     expect(ctrl.messages).toBeTruthy();
  //   });
  });

  // function getDependency() {
  //   return {
  //     uploadRecordPopupService: uploadRecordPopupService,
  //     conversationsService: conversationsService,
  //     uploadService: uploadService,
  //     libraryService: libraryService,
  //     templateService: templateService,
  //     filesService: filesService,
  //   };
  // }
});
