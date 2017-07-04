(function (angular) {
  'use strict';
  angular.module('app').component('recordPopup', {
    templateUrl: 'components/recordPopup/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      getVideos: '&'
    }
  });

  ctrl.$inject = [
    '$mdToast',
    '$rootScope',
    'uploadService',
    'uploadRecordPopupService'
  ];
  function ctrl(
    $mdToast,
    $rootScope,
    uploadService,
    uploadRecordPopupService
  ) {
    var vm = this;

    vm.closeRecordPopup = function () {
      uploadRecordPopupService.hideRecordPopup();
    };

    vm.finishRecord = function (data) {
      vm.recordedData = data;
      vm.showGenerator = true;
      var videoElement = document.getElementById('video-for-thumbnail');
      videoElement.setAttribute('src', data.video);
      var canvas = document.getElementById('canvas');
      canvas.getContext('2d').drawImage(
      videoElement, 0, 0, 300, 150);
      canvas = canvas.toDataURL("image/png");
      vm.showGenerator = false;
    };

    vm.sendRecordClick = function (name) {
      name = name || 'no name';
      uploadService.sendFile(
        '/api/video',
        vm.recordedData.video,
        name + '.wmv'
      ).then(function () {
        

        vm.generateThumbnail();
        vm.closeRecordPopup();
        vm.getVideos();
        vm.videoName = null;
        $mdToast.show(
          $mdToast.simple()
            .textContent('Video saved successfully!')
            .position('bottom center')
            .hideDelay(3000)
        );
      }).catch(function (err) {
        // TODO: add error style
        $mdToast.show(
          $mdToast.simple()
            .textContent(err.data.error)
            .position('bottom center')
            .hideDelay(3000)
        );
      });
    };
  }
})(angular);
