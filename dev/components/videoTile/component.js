(function (angular) {
  'use strict';
  angular.module('app').component('videoTile', {
    templateUrl: 'components/videoTile/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      onSendClick: '&',
      onThumbnailClick: '&',
      onDeleteVideo: '&',
      showSendButton: '<',
      video: '<'
    }
  });

  ctrl.$inject = [];
  function ctrl() {
  }
})(angular);
