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

    this.updatePhoto = function (photo) {
      return $http.post('/api/update-profile-photo', {
        "photo": photo
      });
    };

    this.updateCompanyLogo = function (logo, company) {
      return $http.post('/api/update-company-logo', {
        "logo": logo,
        "company": company
      });
    };
  }
})(angular);