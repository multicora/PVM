describe('profileCtrl', function() {
  'use strict';

  var $controller;
  var $q;
  var $rootScope;
  var profileService;

  beforeEach(module('app'));
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;

    profileService = {
      getProfile: jasmine.createSpy('getProfile').and.callFake(function () {
        return $q.resolve({
          data: {}
        });
      }),
      getCompany: jasmine.createSpy('getCompany').and.callFake(function () {
        return $q.resolve({
          data: {}
        });
      }),
      updateProfile: jasmine.createSpy('updateProfile'),
      updateCompany: jasmine.createSpy('updateCompany')
    };
  }));

  it('should be defined', function() {
    var scope = $rootScope.$new();
    profileService.getProfile();

    var ctrl = $controller('profileCtrl', {
      $scope: scope,
      profileService: profileService,
    });

    scope.$apply();

    expect(ctrl).toBeDefined();
  });

  describe('save', function() {
    it('should save data if "editMod" === true', function() {
      var scope = $rootScope.$new();
      var ctrl = $controller('profileCtrl', {
        $scope: scope,
        profileService: profileService,
      });

      profileService.updateProfile.and.callFake(function () {
        return $q.resolve({
          data: {}
        });
      });

      ctrl.editMod = true;
      ctrl.user = {};
      ctrl.save();
      scope.$apply();

      expect(ctrl.editMod).toBe(false);
    });

    it('should set "editMod" = true if it isn/`t', function() {
      var scope = $rootScope.$new();
      var ctrl = $controller('profileCtrl', {
        $scope: scope,
        profileService: profileService,
      });

      ctrl.save();
      scope.$apply();

      expect(ctrl.editMod).toBe(true);
    });
  });
});
