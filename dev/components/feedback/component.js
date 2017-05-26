'use strict';
(function (angular) {
  angular.module('app').component('feedback', {
    templateUrl: 'components/feedback/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {}
  });

  ctrl.$inject = [
    'feedbacksService',
    '$mdToast'
  ];
  function ctrl(
    feedbacksService,
    $mdToast
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
        vm.feedback = {};
        $mdToast.show(
          $mdToast.simple()
            .textContent('Sent successfully!')
            .position('bottom center')
            .hideDelay(3000)
        );
      }).catch(function (err) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(err.data.error)
            .position('bottom center')
            .hideDelay(3000)
        );
      })
    }
  }
})(angular);