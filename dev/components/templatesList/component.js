'use strict';
(function (angular) {
  angular.module('app').component('templateList', {
    templateUrl: 'components/templatesList/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      onUseClick: '&',
      onDelete: '&',
      onSwipeRight: '&',
      onSwipeLeft: '&',
      list: '<',
    }
  });

  ctrl.$inject = [];
  function ctrl() {
    var vm = this;
  }
})(angular);