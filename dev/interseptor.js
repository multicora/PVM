(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.factory('interseptor', interseptor);

  interseptor.$inject = [
    '$location',
    '$q',
    'loadingService',
    'tokenService',
    'routingCheckingService'
    ];
  function interseptor(
    $location,
    $q,
    loadingService,
    tokenService,
    routingCheckingService
  ) {
    return {
      request: function(request) {
        loadingService.showSpinner();
        request.headers.Authorization = tokenService.tokenName + ' ' + tokenService.getToken();
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
            tokenService.clearToken();
            $location.path('/login');
          }
        }
        return $q.reject(response);
      }
    };
  }
})(angular);
