'use strict';
(function (angular) {
  angular.module('app').directive('onFileChange', function() {
    function link(scope, el, attr) {
      el.attr('onchange', 'angular.element(this).scope().onChange(this.files[0]);');
      scope.onChange = function (file) {
        scope.$file = file;
        scope.$apply(attr.onFileChange);
      };
    }

    return {
      restrict: 'A',
      link: link,
    };
  });
})(angular);