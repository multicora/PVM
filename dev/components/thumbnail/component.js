(function (angular) {
  'use strict';
  angular.module('app').component('thumbnail', {
    templateUrl: 'components/thumbnail/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      video: '&',
    }
  });

  ctrl.$inject = [];
  function ctrl() {
    var vm = this;
    vm.showPlayer = true;

    vm.generate = function() {
      vm.showPlayer = true;
      var videoElement = document.getElementById('video-for-thumbnail');
      var canvas = document.getElementById('canvas');
      canvas.getContext('2d').drawImage(
      videoElement, 0, 0, 300, 150);
      vm.showPlayer = false;
      return canvas;
    }
  }
})(angular);
