'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('uploadService', service);

  service.$inject = ['$http'];
  function service($http) {
    this.sendFile = function(url, file, data) {
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
          responseType: "arraybuffer"
        }
      );
    }
  }
})(angular);