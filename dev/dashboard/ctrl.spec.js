describe('dashboardCtrl', function() {

  var $controller;
  var $q;
  var $rootScope;
  var conversationsService = {
    getByAuthor: jasmine.createSpy('getByAuthor'),
    getChatForDashboard: jasmine.createSpy('getChatForDashboard'),
  };
  var uploadRecordPopupService = {
    showUploadPopup: jasmine.createSpy('showUploadPopup'),
  };
  var uploadService = {};

  beforeEach(module('app'));
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  describe('initial phase', function() {
    it('should get the messages', function() {
      var scope = $rootScope.$new();

      conversationsService.getByAuthor.and.callFake(function () {
        return $q.resolve({
          data: []
        });
      });
      conversationsService.getChatForDashboard.and.callFake(function () {
        return $q.resolve({
          data: [{
            date: 1
          }, {
            date: 3
          }, {
            date: 2
          }]
        });
      });

      var ctrl = $controller('dashboardCtrl', {
        $scope: scope,
        conversationsService: conversationsService,
      });

      scope.$apply();
      expect(ctrl.messages).toBeTruthy();
    });
  });

  describe('uploadBtnClick', function() {
    it('should show upload popup', function() {
      var dependency = getDependency();

      dependency.$scope = $rootScope.$new();
      dependency.conversationsService.getByAuthor.and.callFake(function () {
        return $q.resolve({
          data: []
        });
      });
      dependency.conversationsService.getChatForDashboard.and.callFake(function () {
        return $q.resolve({
          data: [{
            date: 1
          }, {
            date: 3
          }, {
            date: 2
          }]
        });
      });

      var ctrl = $controller('dashboardCtrl', dependency);

      dependency.$scope.$apply();
      ctrl.uploadBtnClick();

      expect(dependency.uploadRecordPopupService.showUploadPopup).toHaveBeenCalled();
    });
  });

  // TODO: test message sorting

  function getDependency() {
    return {
      uploadRecordPopupService: uploadRecordPopupService,
      conversationsService: conversationsService,
      uploadService: uploadService,
    };
  }
});