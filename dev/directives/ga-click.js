(function (angular) {
  'use strict';
  angular.module('app').directive('gaClick', directive);

  directive.$inject = ['ga'];
  function directive(ga) {
    function link(scope, el) {
      function clickHandler() {
        ga.send('event', scope.gaClick, scope.gaClickAction, scope.gaClickLabel);
      }

      el[0].addEventListener('click', clickHandler);

      scope.$on('$destroy', function() {
        el[0].removeEventListener('click', clickHandler);
      });
    }

    return {
      restrict: 'A',
      link: link,
      scope: {
        gaClick: '@',
        gaClickAction: '@',
        gaClickLabel: '@'
      }
    };
  }
})(angular);
