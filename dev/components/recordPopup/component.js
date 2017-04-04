'use strict';
(function (angular) {
  angular.module('app').component('recordPopup', {
    templateUrl: 'components/recordPopup/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      getVideos: '&',
      showRecordPopup: '^'
    }
  });

  ctrl.$inject = [];
  function ctrl() {
    var vm = this;

  }
})(angular);