(function (angular) {
  'use strict';
  angular.module('app').component('videoList', {
    templateUrl: 'components/videoList/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      onUploadClick: '&',
      onRecordClick: '&',
      onSendClick: '&',
      onDeleteVideo: '&',
      onThumbnailClick: '&',
      showSendButton: '<',
      list: '<',
    }
  });

  ctrl.$inject = [];
  function ctrl() {
  }
})(angular);
