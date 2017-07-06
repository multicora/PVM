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
          data: {
            name: ''
          }
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
    it('should call profileService.updateCompany', function() {
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

      ctrl.user = {};
      ctrl.company = {};
      ctrl.save();
      scope.$apply();

      expect(profileService.updateCompany).toHaveBeenCalled();
    });
  });
});
