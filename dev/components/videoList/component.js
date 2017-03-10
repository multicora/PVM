'use strict';
(function (angular) {
  angular.module('app').component('videoList', {
    templateUrl: 'components/videoList/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      onUploadClick: '&',
      onRecordClick: '&',
      onSendClick: '&',
      showSendButton: '=',
      onThumbnailClick: '&',
      list: '<',
    }
  });

  ctrl.$inject = [];
  function ctrl() {
    var vm = this;
  }
})(angular);