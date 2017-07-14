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
    'uploadRecordPopupService',
    'conversationsService'
  ];
  function ctrl(
    $mdToast,
    $rootScope,
    uploadService,
    uploadRecordPopupService,
    conversationsService
  ) {
    var vm = this;
    vm.recordedData = null;
    vm.media = null;
    vm.thumbnail = null;
    vm.showGenerator = false;

    vm.closeRecordPopup = function () {
      uploadRecordPopupService.hideRecordPopup();
    };

    vm.finishRecord = function (data) {
      vm.recordedData = data;
    };

    vm.sendRecordClick = function (name) {
      name = name || 'no name';

      uploadService.sendFile(
        '/api/video',
        vm.recordedData.video,
        {
          name: name + '.wmv'
        }
      ).then(function (res) {
        console.log(res.data);

        return conversationsService.getVideo(res.data.insertId);
      }).then(function(res) {
        var videoElement = document.getElementById('video-for-thumbnail');;
        var canvas = document.getElementById('canvas');;

        vm.media = {
          sources: [{
            src: res.data.attributes.url,
            type: 'video/mp4'
          }]
        };

      vm.showGenerator = true;
      canvas.getContext('2d').drawImage(videoElement, 0, 0, 300, 150);
      vm.thumbnail = canvas.toDataURL('image/png');
      vm.showGenerator = false;

      // return uploadService.sendThumbnail(
        // {
          // thumbnail: vm.thumbnai,
          // video: res.data.id
        // });
      // }).then(function() {
        // vm.closeRecordPopup();
        // vm.getVideos();
        // vm.videoName = null;
        // $mdToast.show(
        //   $mdToast.simple()
        //     .textContent('Video saved successfully!')
        //     .position('bottom center')
        //     .hideDelay(3000)
        // );
      // }).catch(function (err) {
      //   // TODO: add error style
      //   $mdToast.show(
      //     $mdToast.simple()
      //       .textContent(err.data.error)
      //       .position('bottom center')
      //       .hideDelay(3000)
      //   );
      });
    };
  }
})(angular);
