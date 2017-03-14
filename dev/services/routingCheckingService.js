'use strict';

(function(angular) {
  angular
    .module('app')
    .factory('routingCheckingService', routingCheckingService);

  function routingCheckingService() {
    return {
      checkRouting: checkRouting
    }

    function checkRouting(routing) {

      var reg = new RegExp("^\/conversation\/[a-zA-Z0-9]+$|^\/$", "g");

      return routing.match(reg);
    }
  }
})(angular);