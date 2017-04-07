(function (angular) {
  var app = angular.module('app');

  app.controller('libraryCtrl', ctrl);

  ctrl.$inject = [
    '$location',
    '$mdToast',
    '$mdDialog',
    '$timeout',
    'libraryService',
    'uploadService',
    'conversationsService',
    'uploadRecordPopupService'
  ];
  function ctrl(
    $location,
    $mdToast,
    $mdDialog,
    $timeout,
    libraryService,
    uploadService,
    conversationsService,
    uploadRecordPopupService
  ) {
    var vm = this;
    vm.showUploadPopup = true;
    var confirm = $mdDialog.confirm({
      textContent: 'Are you shure?',
      ok: 'Yes',
      cancel: 'No'
    });

    vm.showSendPopup = false;
    vm.recordedData = null;
    vm.showSendButton = true;
    vm.showPreviewPopup = false;

    vm.getVideos = function () {
      libraryService.getVideos().then(function (res) {
        vm.videosList = res.data;
        return libraryService.getThumbnails();
      }).then(function (res) {
        for (let i = 0; i < res.data.length; i++) {
          vm.videosList[i].attributes.thumbnail = res.data[i].attributes;
        }
      });
    };

    vm.getVideos();
    getTemplates();
    getConversations();

    // Delete video
    vm.deleteVideo = function (id) {
      showConfirmDeleteVideo(id);
    };

    vm.uploadBtnClick = function () {
      uploadRecordPopupService.showUploadPopup();
    }

    vm.recordBtnClick = function () {
      uploadRecordPopupService.showRecordPopup();
    };

    vm.finishRecord = function (data) {
      vm.recordedData = data;
    };

    vm.sendRecordClick = function (name) {
      name = name || 'no name';
      uploadService.sendFile(
        "/api/video",
        vm.recordedData.video,
        name + '.wmv'
      ).then(function () {
        vm.closeRecordPopup();
        vm.getVideos();
        vm.videoName = null;
        $mdToast.show(
          $mdToast.simple()
            .textContent('Video saved!')
            .position('bottom center')
        );
      });
    };

    vm.stopPropagation = function($event) {
      $event.stopPropagation();
    };

    //Preview popup
    vm.showPreview = function (video) {
      vm.previewVideo = video;
      conversationsService.getVideo(video.id).then(function (res) {
        vm.previewVideoUrl = {
          sources: [{
            src: res.data.attributes.url,
            type: 'video/mp4'
          }]
        };
      })
      vm.showPreviewPopup = true;
    };

    vm.closePreviewPopup = function () {
      vm.showPreviewPopup = false;
      vm.previewVideo = null;
      vm.previewVideoUrl = null;
    };

    // Send
    vm.sendClickHandler = function (video) {
      $location.path('template/' + video.id);
    };

    // Templates
    vm.deleteTemplate = function (id, event) {
      event.stopPropagation();
      showConfirmDeleteTemplate(id);
    };

    vm.useTemplate = function (id) {
      $location.path('template-edit/' + id);
    };

    vm.viewConversation = function (id) {
      $location.path('conversation/' + id);
    };

    // Confirm popup for delete template
    function showConfirmDeleteTemplate(id) {
      $mdDialog
        .show( confirm ).then(function() {
          libraryService.deleteTemplate(id).then(function() {
            getTemplates();
            $mdToast.show(
              $mdToast.simple()
                .textContent('Template deleted!')
                .position('bottom center')
              );
          });
        })
    };

    // Confirm popup for delete video
    function showConfirmDeleteVideo(id) {
      var alertVideo = $mdDialog.alert({
        textContent: 'This video can not be deleted because you use it in template or conversation.',
        ok: 'Ok'
      });

      $mdDialog
        .show( confirm ).then(function() {
          libraryService.deleteVideo(id).then(function() {
            vm.getVideos();
            $mdToast.show(
              $mdToast.simple()
                .textContent('Video deleted!')
                .position('bottom center')
                .hideDelay(3000)
            );
          }, function(err) {
          $mdDialog.show( alertVideo );
          });
        })
    };

    function getTemplates() {
      libraryService.getTemplates().then(function (res) {
        vm.templatesList = res.data;
      });
    };

    function getConversations() {
      libraryService.getConversations().then(function (res) {
        vm.conversationsList = res.data;
      });
    };

    // For swiping
    vm.selectedIndex = 0;
    vm.changeTab = function (offset) {
      var tabs = 3;
      var newIndex = vm.selectedIndex + offset;

      newIndex = newIndex >= tabs ? tabs - 1 : newIndex;
      newIndex = newIndex < 0 ? 0 : newIndex;
      vm.selectedIndex = newIndex;
    };
  }
})(angular);