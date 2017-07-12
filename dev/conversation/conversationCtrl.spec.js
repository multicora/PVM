describe('conversationCtrl', function() {
  'use strict';

  var $controller;
  var $q;
  var $rootScope;
  var $location;
  var conversationsService;
  var chat;
  var profileService;
  var event;

  beforeEach(module('app'));
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _$location_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    $location = _$location_;

    conversationsService = {
      get: jasmine.createSpy('get').and.callFake(function () {
        return $q.resolve({
          data: {
            author: 1,
            id: 1,
            videoId: 1
          }
        });
      }),
      getChat: jasmine.createSpy('createPublic').and.callFake(function () {
        return $q.resolve({ data: [] });
      }),
      fileDownloaded: jasmine.createSpy('createPublic').and.callFake(function () {
        return $q.resolve({});
      }),
    };
    profileService = {
      getProfile: jasmine.createSpy('getProfile').and.callFake(function () {
        return $q.resolve({
          data: [
            {}
          ]
        });
      }),
    };
    event = {
      stopPropagation: jasmine.createSpy('stopPropagation')
    };
    chat = {
      connect: jasmine.createSpy('getProfile').and.callFake(function () {
        return $q.resolve();
      }),
    };
  }));

  it('should be defined', function() {
    var scope = $rootScope.$new();
    conversationsService.get();
    var ctrl = $controller('conversationCtrl', {
      $scope: scope,
      chat: chat,
      conversationsService: conversationsService,
      profileService: profileService,
    });

    scope.$apply();

    expect(ctrl).toBeDefined();
  });

  describe('contentClick', function() {
    it('should set "showHeader" to headerClass', function() {
      var scope = $rootScope.$new();
      var ctrl = $controller('conversationCtrl', {
        $scope: scope,
        chat: chat,
        conversationsService: conversationsService,
        profileService: profileService
      });

      ctrl.contentClick();

      expect(ctrl.headerClass).toBe('showHeader');
    });
  });

  describe('videoContentClick', function() {
    it('should set "hideHeader" to headerClass', function() {
      var scope = $rootScope.$new();
      var ctrl = $controller('conversationCtrl', {
        $scope: scope,
        chat: chat,
        conversationsService: conversationsService,
        profileService: profileService
      });

      ctrl.videoContentClick(event);

      expect(ctrl.headerClass).toBe('hideHeader');
    });
  });

  describe('back', function() {
    it('should call "location.path" with parametr "/conversations"', function() {
      var scope = $rootScope.$new();
      var ctrl = $controller('conversationCtrl', {
        $scope: scope,
        chat: chat,
        conversationsService: conversationsService,
        profileService: profileService
      });

      ctrl.back(event);

      expect($location.path()).toBe('/conversations');
    });
  });

  describe('onFileClick', function() {
    it('should call "conversationsService.fileDownloaded"', function() {
      var scope = $rootScope.$new();
      var ctrl = $controller('conversationCtrl', {
        $scope: scope,
        chat: chat,
        conversationsService: conversationsService,
        profileService: profileService
      });
      ctrl.conversation = {
        id: 1
      };

      ctrl.onFileClick();

      expect(conversationsService.fileDownloaded).toHaveBeenCalled();
    });
  });
});
