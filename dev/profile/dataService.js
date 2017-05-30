(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('profileService', service);

  service.$inject = ['$http'];
  function service($http) {
    this.getProfile = function () {
      return $http.get('/api/profile');
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
