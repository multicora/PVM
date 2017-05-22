'use strict';
(function (angular) {
  angular.module('app').directive('fileUploader', directive);

  directive.$inject = [
    'uploadService',
    '$mdToast'
  ];
  function directive(
    uploadService,
    $mdToast
  ) {
    return {
      templateUrl: 'components/fileUploader/tpl.html',
      link: link,
      scope: {
        url: '@',
        inputId: '@',
        uploadEnd: '&',
        uploadStart: '&',
        onError: '&'
      }
    };

    function link(scope, element, attrs) {
      var input = element.find('input');

      input.on('change', function (event) {
        if (event.target.files[0]) {
          uploadService.sendFile('/api' + scope.url, event.target.files[0]).then(uploadEnd, onError);
        }
        event.target.value = null;
        scope.uploadStart();
      });

      function uploadEnd() {
        scope.uploadEnd();
        $mdToast.show(
          $mdToast.simple()
            .textContent('Uploaded!')
            .position('bottom center')
            .hideDelay(3000)
        );
      }

      function onError(err) {
        scope.onError(err);
      }
    }

  }
})(angular);