(function (angular) {
  'use strict';
  angular.module('app').directive('recordVideo', directive);

  directive.$inject = [];
  function directive() {
    return {
      templateUrl: 'components/recordVideo/tpl.html',
      // controller: ctrl,
      // controllerAs: 'vm',
      link: link,
      scope: {
        finish: '&'
      }
    };
  }
  function link(scope) {
    var player = videojs(
      'record',
      {
        // video.js options
        controls: true,
        width: 640,
        height: 480,
        plugins: {
          // videojs-record plugin options
          record: {
            audio: true,
            video: true,
            maxLength: 60,
            debug: true
          }
        },
        controlBar: {
          volumeMenuButton: false,
          fullscreenToggle: false
        },
        fluid: true
      }
    );

    player.on('finishRecord', function() {
      // thumbnails.generate(document.getElementById('record_html5_api'));

      player.currentTime(5);
      var videoElement = document.getElementById('record_html5_api');
      document.getElementById('canvas').getContext('2d').drawImage(
      videoElement, 0, 0, 300, 150);

      scope.finish({$data: player.recordedData});
      scope.$apply();
    });

    scope.$on('$destroy', function() {
      player.recorder.destroy();
    });
  }
})(angular);
