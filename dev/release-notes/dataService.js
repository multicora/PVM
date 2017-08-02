(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('releaseNotesService', service);

  service.$inject = [];
  function service() {
    this.get = function () {
      var data = [
          {
            date: '1/2/2017',
            version: '0.0.2a',
            notes: [
              'test1',
              'test2'
            ]
          },
          {
            date: '1/2/2017',
            version: '0.0.2a',
            notes: [
              'test3',
              'test4'
            ]
          }
        ];

        return data;
    };
  };
})(angular);
