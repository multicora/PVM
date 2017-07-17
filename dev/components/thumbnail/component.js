(function (angular) {
  'use strict';
  angular.module('app').component('thumbnail', {
    templateUrl: 'components/thumbnail/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      media: '<',
      videoId: '<',
      onGenerated: '&'
    }
  });

  ctrl.$inject = [
    'uploadService'
  ];
  function ctrl(
    uploadService
  ) {
    var vm = this;
    var time = 5; //time for geting thumbnail
    var videoElement = document.getElementById('video-for-thumbnail');;
    var canvas = document.getElementById('canvas');

    videoElement.onloadeddata = function() {
      this.currentTime = time;
      canvas.getContext('2d').drawImage(videoElement, 0, 0, 300, 150);
      // var thumbnail = new Image();
      // thumbnail.setAttribute('crossOrigin', 'Anonymous');

      var thumbnail = canvas.toDataURL('image/png');
      uploadService.sendThumbnail(
        {
          thumbnail: thumbnail,
          video: vm.videoId
        }
      ).then(function() {
        vm.onGenerated();
      });
    }
  }
})(angular);
