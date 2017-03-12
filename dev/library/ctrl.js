(function (angular) {
  var app = angular.module('app');

  app.controller('libraryCtrl', ctrl);

  ctrl.$inject = [
    '$location',
    'libraryService',
    'uploadService',
    'conversationsService'
  ];
  function ctrl(
    $location,
    libraryService,
    uploadService,
    conversationsService
  ) {
    var vm = this;

    vm.showRecordPopup = false;
    vm.showUploadPopup = false;
    vm.showSendPopup = false;
    vm.recordedData = null;
    vm.showSendButton = true;
    vm.showVideos = true;
    vm.showTemplates = false;

    getVideos();
    getTemplates();

    libraryService.getThumbnails().then(function (res) {
      for (let i = 0; i < res.data.length; i++) {
        vm.videosList[i].attributes.thumbnail = res.data[i].attributes;
      }
    });

    // Rocord popup
    vm.recordBtnClick = function () {
      vm.showRecordPopup = true;
    };

    vm.closeRecordPopup = function () {
      vm.showRecordPopup = false;
    };

    vm.finishRecord = function (data) {
      vm.recordedData = data;
    };

    vm.sendRecordClick = function (name) {
      name = name || '';
      uploadService.sendFile(
        "/api/video",
        vm.recordedData.video,
        vm.videoName + '.wmv'
      ).then(function () {
        vm.closeRecordPopup();
        getVideos();
        vm.videoName = null;
      });
    };

    // Upload popup
    vm.uploadBtnClick = function () {
      vm.showUploadPopup = true;
    };

    vm.closeUploadPopup = function () {
      vm.showUploadPopup = false;
    };

    vm.uploadEnd = function () {
      vm.closeUploadPopup();
      getVideos();
    }

    // Send
    vm.sendClickHandler = function (video) {
      $location.path('template/' + video.id);
    }

    // Tabs
    vm.tabBtnVideosClick = function (tab) {
      vm.showTemplates = false;
      vm.showVideos = true;
    }

    vm.tabBtnTemplatesClick = function (tab) {
      vm.showVideos = false;
      vm.showTemplates = true;
    }

    // Templates
    vm.deleteTemplate = function (id) {
      libraryService.deleteTemplate(id).then(function() {
        getTemplates();
      });
    }

    vm.useTemplate = function (id) {
      $location.path('template-edit/' + id);
    }

    function getVideos() {
      libraryService.getVideos().then(function (res) {
        vm.videosList = res.data;
      });
    };

    function getTemplates() {
      libraryService.getTemplates().then(function (res) {
        vm.templatesList = res.data;
      });
    };
  }
})(angular);