(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.factory('interseptor', interseptor);

  interseptor.$inject = [
    '$location',
    '$q',
    'storage',
    'routingCheckingService'
    ];
  function interseptor(
    $location,
    $q,
    storage,
    routingCheckingService
  ) {
    var tokenName = 'x-biz-token';

    return {
      request: function(request) {
        request.headers.Authorization = tokenName + ' ' + storage.get(tokenName);
        return request;
      },
      response: function(response) {
        return response;
      },
      responseError: function(response) {
        if (response.status === 401) {
          var url = $location.url();
          if (!routingCheckingService.checkRouting(url)) {
            storage.clear(tokenName);
            $location.path('/login');
          }
        }
        return $q.reject(response);
      }
    };
  }
})(angular);
