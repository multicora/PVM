(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('filesService', service);

  service.$inject = [
    '$q',
    'libraryService'
  ];
  function service(
    $q,
    libraryService
  ) {
    var vm = this;
    vm.byteInMegabayte = 1048576;
    vm.byteInKilobyte = 1024;

    vm.getFiles = function () {
      return $q(function(resolve) {

        // TODO: add .catch() part
        libraryService.getFiles().then(function (res) {
          res.data.map(function(file) {
            if (file.attributes.size >= vm.byteInKilobyte ) {
              if (file.attributes.size >= vm.byteInMegabayte ) {
                file.attributes.size /= vm.byteInMegabayte;
                file.attributes.size = file.attributes.size.toFixed(2);
                file.attributes.size += ' mb';
              } else {
                file.attributes.size /= vm.byteInKilobyte;
                file.attributes.size = file.attributes.size.toFixed(2);
                file.attributes.size += ' kb';
              }
            } else {
              file.attributes.size = file.attributes.size.toFixed(2);
              file.attributes.size += ' b';
            }

            file.attributes.date = new Date(file.attributes.date).toLocaleDateString();
          });

          resolve(res.data);
        });
      });

    };
  }
})(angular);
