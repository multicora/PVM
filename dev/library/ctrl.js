(function (angular) {
  var app = angular.module('app');

  app.controller('libraryCtrl', ctrl);

  ctrl.$inject = [
    '$location',
    '$mdToast',
    '$mdDialog',
    'libraryService',
    'uploadService',
    'conversationsService',
    'uploadRecordPopupService'
  ];
  function ctrl(
    $location,
    $mdToast,
    $mdDialog,
    libraryService,
    uploadService,
    conversationsService,
    uploadRecordPopupService
  ) {
    var vm = this;
    var confirmDeletePopup = $mdDialog.confirm({
      title: 'Are you shure?',
      textContent: 'This action can`t be undone',
      ok: 'Delete',
      cancel: 'Cancel'
    });

    vm.showUploadPopup = true;
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
      }, function (err) {
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
      $location.url('template/?video=' + video.id);
    };

    // Templates
    vm.deleteTemplate = function (id, event) {
      event.stopPropagation();
      showConfirmDeleteTemplate(id);
    };

    vm.useTemplate = function (id) {
      $location.path('template/' + id);
    };

    vm.viewConversation = function (id) {
      $location.path('conversation/' + id);
    };

    // Confirm popup for delete template
    function showConfirmDeleteTemplate(id) {
      $mdDialog
        .show( confirmDeletePopup ).then(function() {
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
      var alertErrorDelete = $mdDialog.alert({
        textContent: 'This video can not be deleted because you use it in template or conversation.',
        ok: 'Ok'
      });

      $mdDialog
        .show( confirmDeletePopup ).then(function() {
          libraryService.deleteVideo(id).then(function() {
            vm.getVideos();
            $mdToast.show(
              $mdToast.simple()
                .textContent('Video deleted!')
                .position('bottom center')
                .hideDelay(3000)
            );
          }, function(err) {
          $mdDialog.show( alertErrorDelete );
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