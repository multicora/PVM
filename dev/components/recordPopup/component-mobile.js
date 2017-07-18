(function (angular) {
  'use strict';
  angular.module('app').component('recordMobilePopup', {
    templateUrl: 'components/recordPopup/tplMobile.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      getVideos: '&'
    }
  });

  ctrl.$inject = [
    'uploadService',
    'uploadRecordPopupService',
    'tools'
  ];
  function ctrl(
    uploadService,
    uploadRecordPopupService,
    tools
  ) {
    var vm = this;

    vm.videoFile = null;
    vm.videoName = null;
    vm.media = null;
    vm.videoIdThumbnail = null;

    vm.closeRecordPopup = function () {
      uploadRecordPopupService.hideRecordPopup();
    };

    vm.finishRecord = function (file) {
      vm.videoFile = file;
    };

    vm.sendRecordClick = function (name) {
      name = name || 'no name';
      uploadService.sendFile(
        '/api/video',
        vm.videoFile,
        name + '.' + tools.getExtension(vm.videoFile.name)
      ).then(function () {
        return conversationsService.getVideo(res.data.insertId);
      }).then(function(res) {
        vm.media = res.data.attributes.url;
        vm.videoIdThumbnail = res.data.id;
      }).catch(function (err) {
        // TODO: add error style
        $mdToast.show(
          $mdToast.simple()
            .textContent(err.data.error)
            .position('bottom center')
            .hideDelay(3000)
        );
      });

      vm.generatedThumbnail = function() {
        vm.getVideos();
        vm.videoName = null;
        vm.closeRecordPopup();
        $mdToast.show(
          $mdToast.simple()
            .textContent('Video saved successfully!')
            .position('bottom center')
            .hideDelay(3000)
        );
      };
    };
  }
})(angular);
