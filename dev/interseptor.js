(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.factory('interseptor', interseptor);

  interseptor.$inject = [
    '$location',
    '$q',
    'loadingService',
    'storage',
    'routingCheckingService'
    ];
  function interseptor(
    $location,
    $q,
    loadingService,
    storage,
    routingCheckingService
  ) {
    var tokenName = 'x-biz-token';

    return {
      request: function(request) {
        loadingService.showSpinner();
        request.headers.Authorization = tokenName + ' ' + storage.get(tokenName);
        return request;
      },
      response: function(response) {
        loadingService.hideSpinner();
        return response;
      },
      responseError: function(response) {
        loadingService.hideSpinner();
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
