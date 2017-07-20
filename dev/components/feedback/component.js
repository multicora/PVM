(function (angular) {
  'use strict';
  angular.module('app').component('feedback', {
    templateUrl: 'components/feedback/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      closeFeedback: '&'
    }
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

    vm.sendClickHandler = function() {
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
      });
    };
  }
})(angular);
