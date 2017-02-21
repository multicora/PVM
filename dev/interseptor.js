'use strict';
(function(angular) {
  var app = angular.module('app');

  app.factory('interseptor', interseptor);

  interseptor.$inject = ['$location', 'loadingService', 'tokenService'];
  function interseptor($location, loadingService, tokenService) {
    return {
      request: function(request) {
        loadingService.showSpinner();
        request.headers['Authorization'] = tokenService.tokenName + ' ' + tokenService.getToken();
        return request;
      },
      response: function(response) {
        loadingService.hideSpinner();
        return response;
      },
      responseError: function(response) {
        loadingService.hideSpinner();
        if (response.status == 401) {
          tokenService.clearToken();
          $location.path('/login');
        }
        return $q.reject(response);;
      }
    };
  }
})(angular);