(function (angular) {
  'use strict';
  angular.module('app').component('filesList', {
    templateUrl: 'components/filesList/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      onUploadEnd: '&',
      onUseClick: '&',
      onDelete: '&',
      showDeleteButton: '<',
      showUseButton: '<',
      list: '<',
    }
  });

  ctrl.$inject = [];
  function ctrl() {
  }
})(angular);
