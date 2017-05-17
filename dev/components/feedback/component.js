'use strict';
(function (angular) {
  angular.module('app').component('feedback', {
    templateUrl: 'components/feedback/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      showFeedbackPopup: '<',
      closePopup: '&'
    }
  });

  ctrl.$inject = [
  ];
  function ctrl(
  ) {
    var vm = this;

    vm.sendClickHandler = function(data) {
      console.log(data);
    }
  }
})(angular);