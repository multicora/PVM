(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('profileService', service);

  service.$inject = [
    '$http',
    '$q',
    'storage',
    'TOKEN_NAME'
  ];
  function service(
    $http,
    $q,
    storage,
    TOKEN_NAME
  ) {
    this.getProfile = function () {
      if (storage.get(TOKEN_NAME)) {
        return $http.get('/api/profile');
      }
      return $q.reject();
    };

    this.getProfilePhoto = function (id) {
      return $http.get('/api/profile-photo/' + id);
    };

    this.getCompany = function (id) {
      return $http.post('/api/company', id);
    };

    this.updateProfile = function (user) {
      return $http.post('/api/update-profile', user);
    };

    this.updateCompany = function (company) {
      return $http.post('/api/update-company', company);
    };

    this.updatePhoto = function (photo) {
      return $http.post('/api/update-profile-photo', {
        photo: photo
      });
    };

    this.updateCompanyLogo = function (logo, company) {
      return $http.post('/api/update-company-logo', {
        logo: logo,
        company: company
      });
    };
  }
})(angular);
