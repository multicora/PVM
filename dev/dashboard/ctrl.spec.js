describe('dashboardCtrl', function() {
  'use strict';

  var $controller;
  var $q;
  var $rootScope;
  var conversationsService = {
    getByAuthor: jasmine.createSpy('getByAuthor'),
    getChatForDashboard: jasmine.createSpy('getChatForDashboard'),
  };
  var libraryService = {
    getEvents: jasmine.createSpy('getEvents')
  };

  beforeEach(module('app'));
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  // describe('initial phase', function() {
  //   it('should get the messages', function() {
  //     var scope = $rootScope.$new();

  //     conversationsService.getByAuthor.and.callFake(function () {
  //       return $q.resolve({
  //         data: [
  //           {id: 1},
  //           {id: 2}
  //         ]
  //       });
  //     });

  //     libraryService.getEvents.and.callFake(function () {
  //       return $q.resolve({
  //         data: [
  //           {
  //             type: CONVERSATION_IS_VIEWED 
  //           },
  //           {
  //             type: VIDEO_IS_WATCHED 
  //           },
  //           {
  //             type: FILE_IS_DOWNLOADED 
  //           }
  //         ]
  //       });
  //     })
      
  //     conversationsService.getChatForDashboard.and.callFake(function () {
  //       return $q.resolve({
  //         data: [{
  //           date: 1
  //         }, {
  //           date: 3
  //         }, {
  //           date: 2
  //         }]
  //       });
  //     });

  //     var ctrl = $controller('dashboardCtrl', {
  //       $scope: scope,
  //       conversationsService: conversationsService,
  //       libraryService: libraryService
  //     });

  //     scope.$apply();
  //     expect(ctrl.messages).toBeTruthy();
  //   });
  // });

  // TODO: test message sorting
});
