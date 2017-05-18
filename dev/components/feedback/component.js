'use strict';
(function (angular) {
  angular.module('app').component('feedback', {
    templateUrl: 'components/feedback/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {}
  });

  ctrl.$inject = [
    'feedbacksService'
  ];
  function ctrl(
    feedbacksService
  ) {
    var vm = this;
    vm.showFeedbackPopup = false;

    vm.show = function() {
      vm.showFeedbackPopup = true;
    };

    vm.close = function() {
      vm.showFeedbackPopup = false;
    }

    vm.sendClickHandler = function(data) {
      feedbacksService.send(vm.feedback).then( function() {
        vm.showFeedbackPopup = false;
      });
    }
  }
})(angular);