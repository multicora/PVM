(function (angular) {
  'use strict';
  angular.module('app').component('videoList', {
    templateUrl: 'components/videoList/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      onSendClick: '&',
      onDeleteVideo: '&',
      onThumbnailClick: '&',
      showSendButton: '<',
      list: '<',
    }
  });

  ctrl.$inject = ['uploadRecordPopupService'];
  function ctrl(uploadRecordPopupService) {
    var vm = this;

    vm.onUploadBtnClick = function () {
      uploadRecordPopupService.showUploadPopup();
    };

    vm.onRecordBtnClick = function () {
      uploadRecordPopupService.showRecordPopup();
    };
  }
})(angular);
