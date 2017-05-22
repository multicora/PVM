'use strict';
(function (angular) {
  angular.module('app').component('fileTile', {
    templateUrl: 'components/fileTile/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      onSendClick: '&',
      onDeleteVideo: '&',
      showSendButton: '<',
      file: '<'
    }
  });

  ctrl.$inject = [];
  function ctrl() {
    var vm = this;
  }
})(angular);