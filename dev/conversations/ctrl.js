(function (angular) {
  'use strict';
  var app = angular.module('app');

  app.controller('conversationsCtrl', ctrl);

  ctrl.$inject = [
    '$location',
    'libraryService',
    'uploadService',
    'uploadRecordPopupService'
  ];
  function ctrl(
    $location,
    libraryService,
    uploadService,
    uploadRecordPopupService
  ) {
    var vm = this;

    vm.showUploadPopup = true;
    vm.recordedData = null;
    vm.showConversationIndicators = true;
    vm.toUser = true;

    getConversations();

    vm.uploadBtnClick = function () {
      uploadRecordPopupService.showUploadPopup();
    };

    vm.recordBtnClick = function () {
      uploadRecordPopupService.showRecordPopup();
    };

    vm.finishRecord = function (data) {
      vm.recordedData = data;
    };

    vm.stopPropagation = function($event) {
      $event.stopPropagation();
    };

    vm.viewConversation = function (id) {
      $location.path('conversation/' + id);
    };

    function getConversations () {
      libraryService.getConversations().then(function (res) {
        vm.conversationsList = res.data;
      });
    };
  }
})(angular);
