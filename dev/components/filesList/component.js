'use strict';
(function (angular) {
  angular.module('app').component('filesList', {
    templateUrl: 'components/filesList/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      onUploadEnd: '&',
      onSendClick: '&',
      onDeleteFile: '&',
      showSendButton: '<',
      list: '<',
    }
  });

  ctrl.$inject = [];
  function ctrl() {
    var vm = this;
  }
})(angular);