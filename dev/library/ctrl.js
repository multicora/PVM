(function (angular) {
  'use strict';
  var app = angular.module('app');

  app.controller('libraryCtrl', ctrl);

  ctrl.$inject = [
    '$location',
    '$mdToast',
    '$mdDialog',
    'libraryService',
    'conversationsService',
    'filesService'
  ];
  function ctrl(
    $location,
    $mdToast,
    $mdDialog,
    libraryService,
    conversationsService,
    filesService
  ) {
    var vm = this;
    var confirmDeletePopup = $mdDialog.confirm({
      title: 'Are you shure?',
      textContent: 'This action can`t be undone',
      ok: 'Delete',
      cancel: 'Cancel'
    });

    vm.showSendButton = true;
    vm.showPreviewPopup = false;
    vm.toUser = true;
    vm.showFeedbackPopup = false;

    getVideos();
    getFiles();
    getTemplates();

    vm.getVideos = getVideos;

    // Delete video
    vm.deleteVideo = function (id) {
      showConfirmDeleteVideo(id);
    };

    // Upload files
    vm.onUploadFileEnd = function () {
      getFiles();
    };

    //Delete file
    vm.deleteFile = function (id) {
      showConfirmDeleteFile(id);
    };

    vm.stopPropagation = function($event) {
      $event.stopPropagation();
    };

    vm.showFeedback = function () {
      vm.showFeedbackPopup = true;
    };

    vm.closeFeedback = function () {
      vm.showFeedbackPopup = false;
    };

    //Preview popup
    vm.showPreview = function (video) {
      var ext = video.attributes.external_file_name.split('.').pop();
      ext = (ext === 'wmv') ? 'webm' : ext;

      vm.previewVideo = video;
      vm.showPreviewPopup = true;
      conversationsService.getVideo(video.id).then(function (res) {
        vm.previewVideoUrl = {
          sources: [{
            src: res.data.attributes.url,
            type: 'video/' + (ext || 'mp4')
            // type: 'video/mp4'
          }]
        };
      }).catch(function (err) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(err.data.message)
            .position('bottom center')
            .hideDelay(5000)
        );
      });
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

    // Confirm popup for delete template
    function showConfirmDeleteTemplate(id) {
      $mdDialog.show( confirmDeletePopup ).then(function() {
        return libraryService.deleteTemplate(id).then(function() {
          $mdToast.show(
            $mdToast.simple()
              .textContent('Template deleted!')
              .position('bottom center')
          );
          return getTemplates();
        });
      }).catch(function (err) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(err.data.message)
            .position('bottom center')
            .hideDelay(5000)
        );
      });
    };

    // Confirm popup for delete file
    function showConfirmDeleteFile(id) {
      var alertErrorDelete = $mdDialog.alert({
        textContent: 'This file can not be deleted because you use it in template or conversation.',
        ok: 'Ok'
      });

      $mdDialog
        .show( confirmDeletePopup ).then(function() {
          libraryService.deleteFile(id).then(function() {
            getFiles();
            $mdToast.show(
              $mdToast.simple()
                .textContent('File deleted!')
                .position('bottom center')
                .hideDelay(3000)
            );
          }, function() {
            $mdDialog.show( alertErrorDelete );
          });
        });
    };

    // Confirm popup for delete video
    function showConfirmDeleteVideo(id) {
      var alertErrorDelete = $mdDialog.alert({
        textContent: 'This video can not be deleted because you use it in template or conversation.',
        ok: 'Ok'
      });

      $mdDialog.show( confirmDeletePopup ).then(function() {
        libraryService.deleteVideo(id).then(function() {
          vm.getVideos();
          $mdToast.show(
            $mdToast.simple()
              .textContent('Video deleted!')
              .position('bottom center')
              .hideDelay(3000)
          );
        }, function() {
          $mdDialog.show( alertErrorDelete );
        });
      });
    };

    function getTemplates () {
      return libraryService.getTemplates().then(function (res) {
        vm.templatesList = res.data;
      }).catch(function (err) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(err.data.error)
            .position('bottom center')
            .hideDelay(5000)
        );
      });
    }

    function getFiles () {
      filesService.getFiles().then(function(res) {
        vm.filesList = res;
      }).catch(function (err) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(err.data.error)
            .position('bottom center')
            .hideDelay(5000)
        );
      });
    }

    function getVideos () {
      return libraryService.getVideos().then(function (res) {
        vm.videosList = res.data;
      }).catch(function (err) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(err.data.message)
            .position('bottom center')
            .hideDelay(5000)
        );
      });
    }

    // For swiping
    // vm.selectedIndex = 0;
    // vm.changeTab = function (offset) {
    //   var tabs = 3;
    //   var newIndex = vm.selectedIndex + offset;

    //   newIndex = newIndex >= tabs ? tabs - 1 : newIndex;
    //   newIndex = newIndex < 0 ? 0 : newIndex;
    //   vm.selectedIndex = newIndex;
    // };
  }
})(angular);
