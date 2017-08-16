(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('releaseNotesService', service);

  service.$inject = [];
  function service() {
    this.get = function () {
      var data = [
          {
            date: '14/08/2017',
            version: '0.0.4',
            notes: [
              'Sound alerts when new message arrives',
              'Conversation history log',
              'New conversations list design',
              'User can send the message right from the video recording screen',
              'Newly recorded videos now appear on the top of the video library',
              'iPhone 6 Plus app view issue',
              'Unread messages now have blue bubble and much more bold fonts',
              'Bug fixes'
            ]
          },
          {
            date: '1/08/2017',
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
            date: '18/07/2017',
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
          },
          {
            date: '14/07/2017',
            version: '0.0.1',
            notes: [
              'Initial countable release',
              'Video uploading/recording, sending, tracking',
              'Landing page templates',
              'Two way conversations',
              'User in-app notifications',
              'Email notifications',
              'File attachments',
              'Dashboard',
              'User profile page',
              'Mobile friendly web application'
            ]
          }
        ];

        return data;
    };
  };
})(angular);
