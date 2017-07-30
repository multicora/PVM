(function (angular) {
  'use strict';
  angular.module('app').component('appMenu', {
    templateUrl: 'components/menu/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      className: '@',
      showFeedback: '&'
    }
  });

  ctrl.$inject = [
    '$location',
    'storage',
    'notificationsService'
  ];
  function ctrl(
    $location,
    storage,
    notificationsService
  ) {
    var vm = this;
    var tokenName = 'x-biz-token';

    vm.unreadedMessage = null;
    vm.url = $location.url();

    notificationsService.getUnreadedMessage().then(function(res) {
      vm.unreadedMessage = res.data.length;
    });

    vm.redirect = function(url, urlParam) {
      if (urlParam) {
        return $location.path(url + '/' + urlParam);
      } else {
        return $location.path(url);
      }
    };

    vm.invalidateSession = function () {
      storage.clear(tokenName);
      $location.path('/login');
    };

    vm.href = $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port + '/' + 'release-notes';
  }
})(angular);
