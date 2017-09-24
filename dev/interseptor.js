(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.factory('interseptor', interseptor);

  interseptor.$inject = [
    '$location',
    '$q',
    'storage',
    'routingCheckingService',
    'TOKEN_NAME'
    ];
  function interseptor(
    $location,
    $q,
    storage,
    routingCheckingService,
    TOKEN_NAME
  ) {
    return {
      request: function(request) {
        request.headers.Authorization = TOKEN_NAME + ' ' + storage.get(TOKEN_NAME);
        return request;
      },
      response: function(response) {
        return response;
      },
      responseError: function(response) {
        if (response.status === 401) {
          var url = $location.url();
          if (!routingCheckingService.checkRouting(url)) {
            storage.clear(TOKEN_NAME);
            $location.path('/login');
          }
        }
        return $q.reject(response);
      }
    };
  }
})(angular);
