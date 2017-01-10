(function (angular) {
  var app = angular.module('app');

  app.controller('libraryCtrl', ctrl);

  ctrl.$inject = ['libraryService', 'uploadService', 'conversationsService'];
  function ctrl(libraryService, uploadService, conversationsService) {
    var vm = this;

    vm.showRecordPopup = false;
    vm.showUploadPopup = false;
    vm.showSendPopup = false;
    vm.recordedData = null;

    vm.getVideos = function () {
      libraryService.getVideos().then(function (res) {
        vm.list = res.data.data;
      });
    };

    vm.getVideos();


    libraryService.getThumbnails().then(function (res) {
      for (let i = 0; i < res.data.data.length; i++) {
        vm.list[i].attributes.thumbnail = res.data.data[i].attributes;
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
        {name: name + '.wmv'}
      ).then(function () {
        vm.closeRecordPopup();
        vm.getVideos();
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
      vm.getVideos();
    }

    // Send
    vm.sendClickHandler = function (video) {
      vm.videoForSending = video;
      vm.showSendPopup = true;
    }

    vm.closeSendPopup = function () {
      vm.showSendPopup = false;
    }

    vm.sendVideo = function (email, video) {
      conversationsService.create(email, video).then(function () {
        vm.showSendPopup = false;
      });
    }
  }
})(angular);