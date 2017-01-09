'use strict';
(function (angular) {
  angular.module('app').component('videoFabButtons', {
    templateUrl: 'components/videoFabButtons/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    transclude: true,
    bindings: {
      uploadBtnClick: '&',
      recordBtnClick: '&',
    }
  });

  ctrl.$inject = [];
  function ctrl() {
    var vm = this;
  }
})(angular);