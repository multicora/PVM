(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('uploadService', service);

  service.$inject = [
    '$http',
    'tools'
  ];
  function service(
    $http,
    tools
  ) {
    this.sendVideo = function(name, url, file) {
      name = name || 'no name';
      var data = name + '.' + tools.getExtension(file.name);

      return send(url, file, data);
    };

    this.sendFile = function(url, file, data) {
      return send(url, file, data);
    };

    function send(url, file, data) {
      var formData = new FormData();
      formData.append('file', file);
      formData.append('data', data);

      return $http.post(
        url,
        formData,
        {
          withCredentials: false,
          headers: {
            'Content-Type': void 0,
            'Connection': 'keep-alive',
            'Keep-Alive': 'timeout=2000, max=10000'
          },
          transformRequest: angular.identity,
          responseType: 'json'
        }
      );
    }
  }
})(angular);
