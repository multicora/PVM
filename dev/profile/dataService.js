'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('profileService', service);

  service.$inject = ['$http'];
  function service($http) {
    this.getProfile = function () {
      return $http.get('/api/profile');
    };

    this.updateProfile = function (user, company) {
      return $http.post('/api/update-profile', {
        "user": user,
        "company": company
      });
    };
  }
})(angular);