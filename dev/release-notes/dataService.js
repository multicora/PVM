(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('releaseNotesService', service);

  service.$inject = [];
  function service() {
    this.get = function () {
      var data = [
          {
            date: '31/06/2017',
            version: '0.0.3',
            notes: [
              'Implemented beta-users invitaion system',
              'Added thumbnails for the videos in the library',
              'Improved User Unterface',
              'Added unread conversations indicator',
              'Improved old browsers support',
              'Improved Safari browser support',
              'Added Release notes',
              'Bug fixes'
            ]
          },
          {
            date: '17/06/2017',
            version: '0.0.2',
            notes: [
              'Redesigned Dashboard interface',
              'UX improvements',
              'New User Interface',
              'Improved notifications design',
              'Added version info',
              'New design of user Profile page',
              'Made user\'s company logo as a default for the conversations',
              'New look of the conversations cards',
              'Made current page highlited on the menu',
              'Improved app navigation',
              'Bug fixes'
            ]
          }
        ];

        return data;
    };
  };
})(angular);
