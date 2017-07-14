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
    vm.recordedData = null;
    vm.showGenerator = false;

    vm.closeRecordPopup = function () {
      uploadRecordPopupService.hideRecordPopup();
    };

    vm.finishRecord = function (data) {
      var thumbnail;
      var videoElement;
      var canvas;
      vm.recordedData = data;
      vm.showGenerator = true;

      videoElement = document.getElementById('video-for-thumbnail');
      canvas = document.getElementById('canvas');

      canvas.getContext('2d').drawImage(videoElement, 0, 0, 300, 150);
      thumbnail = canvas.toDataURL('image/png');
      vm.showGenerator = false;
      console.log(thumbnail);
    };

    vm.sendRecordClick = function (name) {
      name = name || 'no name';
      uploadService.sendFile(
        '/api/video',
        vm.recordedData.video,
        name + '.wmv'
      ).then(function () {

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
