describe('templateCtrl', function() {

  var $controller;
  var $q;
  var $rootScope;
  var $routeParams;
  var $location;
  var conversationsService;
  var libraryService;
  var filesService;
  var profileService;
  var templateService;
  var uploadRecordPopupService;
  var uploadService = {};

  beforeEach(module('app'));
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _$location_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    $location = _$location_;

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
    uploadRecordPopupService = {
      showUploadPopup: jasmine.createSpy('showUploadPopup'),
      showRecordPopup: jasmine.createSpy('showRecordPopup'),
    };
    conversationsService = {
      create: jasmine.createSpy('create').and.callFake(function () {
        return $q.resolve();
      }),
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
  });

  describe('sendTemplate', function() {
    it('should set "vm.videoList"', function() {
      var scope = $rootScope.$new();
      var email;
      var ctrl = $controller('templateCtrl', {
        $scope: scope,
        templateService: templateService,
        libraryService: libraryService,
        filesService: filesService,
        conversationsService: conversationsService,
        profileService: profileService,
      });

      ctrl.nameObj.name = 'name';
      ctrl.companyRole.role = 'role';
      ctrl.sendData = {};

      ctrl.sendTemplate(email);
      scope.$apply();

      expect(ctrl.showSendPopup).toBe(false);
      expect($location.path()).toBe('/library');
    });
  });

  describe('uploadBtnClick', function() {
    it('should show upload popup', function() {
      var scope = $rootScope.$new();
      var ctrl = $controller('templateCtrl', {
        $scope: scope,
        templateService: templateService,
        libraryService: libraryService,
        filesService: filesService,
        conversationsService: conversationsService,
        profileService: profileService,
        uploadRecordPopupService: uploadRecordPopupService
      });

      ctrl.uploadBtnClick();

      expect(uploadRecordPopupService.showUploadPopup).toHaveBeenCalled();
    });
  });

  describe('recordBtnClick', function() {
    it('should show record popup', function() {
      var scope = $rootScope.$new();
      var ctrl = $controller('templateCtrl', {
        $scope: scope,
        templateService: templateService,
        libraryService: libraryService,
        filesService: filesService,
        conversationsService: conversationsService,
        profileService: profileService,
        uploadRecordPopupService: uploadRecordPopupService
      });

      ctrl.recordBtnClick();

      expect(uploadRecordPopupService.showRecordPopup).toHaveBeenCalled();
    });
  });

  describe('edit', function() {
    it('should set true into "edit mode"', function() {
      var scope = $rootScope.$new();
      var ctrl = $controller('templateCtrl', {
        $scope: scope,
        templateService: templateService,
        libraryService: libraryService,
        filesService: filesService,
        conversationsService: conversationsService,
        profileService: profileService,
      });
      var element = {};

      ctrl.edit(element);
      expect(element.editMode).toBe(true);
    });
  });

  describe('closeSendPopup', function() {
    it('should set false into "showSendPopup"', function() {
      var scope = $rootScope.$new();

      var ctrl = $controller('templateCtrl', {
        $scope: scope,
        templateService: templateService,
        libraryService: libraryService,
        filesService: filesService,
        conversationsService: conversationsService,
        profileService: profileService,
      });

      ctrl.closeSendPopup();

      expect(ctrl.showSendPopup).toBe(false);
    });
  });

  describe('closeSelectFilePopup', function() {
    it('should set false into "showSelectFilePopup"', function() {
      var scope = $rootScope.$new();

      var ctrl = $controller('templateCtrl', {
        $scope: scope,
        templateService: templateService,
        libraryService: libraryService,
        filesService: filesService,
        conversationsService: conversationsService,
        profileService: profileService,
      });

      ctrl.closeSelectFilePopup();

      expect(ctrl.showSelectFilePopup).toBe(false);
    });
  });

  describe('closeSelectPopup', function() {
    it('should set false into "showSelectPopup"', function() {
      var scope = $rootScope.$new();

      var ctrl = $controller('templateCtrl', {
        $scope: scope,
        templateService: templateService,
        libraryService: libraryService,
        filesService: filesService,
        conversationsService: conversationsService,
        profileService: profileService,
      });

      ctrl.closeSelectPopup();

      expect(ctrl.showSelectPopup).toBe(false);
    });
  });

  describe('deleteFile', function() {
    it('should delete file from "files"', function() {
      var scope = $rootScope.$new();
      var index = 2;
      var length;
      var ctrl = $controller('templateCtrl', {
        $scope: scope,
        templateService: templateService,
        libraryService: libraryService,
        filesService: filesService,
        conversationsService: conversationsService,
        profileService: profileService,
      });

      ctrl.files = [1, 2, 3];
      length = ctrl.files.length;
      ctrl.deleteFile(index);

      expect(ctrl.files.length).toBe(length - 1);
    });
  });

  describe('onUseFileClick', function() {
    it('should add file to "files" if file id and id file from files list is equal and files length <= 3', function() {
      var scope = $rootScope.$new();
      var showSelectFilePopup;
      var length;
      var id = 1;
      var ctrl = $controller('templateCtrl', {
        $scope: scope,
        templateService: templateService,
        libraryService: libraryService,
        filesService: filesService,
        conversationsService: conversationsService,
        profileService: profileService,
      });

      ctrl.files = [
        {
          id: 1
        },
        {
          id: 2
        }
      ];
      length = ctrl.files.length;
      ctrl.filesList = [
        {
          id: 1
        }
      ];

      ctrl.onUseFileClick(id);

      expect(ctrl.files.length).toBe(length + 1);
    });
  });

  describe('onUseFileClick', function() {
    it('should/`nt add file to "files" if file id and id file from files list is/`nt equal and files length <= 3', function() {
      var scope = $rootScope.$new();
      var showSelectFilePopup;
      var length;
      var id = 3;
      var ctrl = $controller('templateCtrl', {
        $scope: scope,
        templateService: templateService,
        libraryService: libraryService,
        filesService: filesService,
        conversationsService: conversationsService,
        profileService: profileService,
      });

      ctrl.files = [
        {
          id: 1
        },
        {
          id: 2
        }
      ];
      length = ctrl.files.length;
      ctrl.filesList = [
        {
          id: 1
        }
      ];

      ctrl.onUseFileClick(id);

      expect(ctrl.files.length).toBe(length);
    });
  });

  describe('onUseFileClick', function() {
    it('should/`nt add file to "files" if > 3', function() {
      var scope = $rootScope.$new();
      var showSelectFilePopup;
      var length;
      var id = 1;
      var ctrl = $controller('templateCtrl', {
        $scope: scope,
        templateService: templateService,
        libraryService: libraryService,
        filesService: filesService,
        conversationsService: conversationsService,
        profileService: profileService,
      });

      ctrl.files = [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        },
        {
          id: 4
        }
      ];
      length = ctrl.files.length;
      ctrl.filesList = [
        {
          id: 1
        }
      ];

      ctrl.onUseFileClick(id);

      expect(ctrl.files.length).toBe(length);
    });
  });
});
