(function(angular) {
  'use strict';
  var app = angular.module('app');
  var vocabulary;

  app.service('translations', service);

  service.$inject = [];
  function service() {
    var currentLang = 'en';

    this.setLang = function (lang) {
      currentLang = vocabulary[lang] ? lang : currentLang;
    };

    this.txt = function (key) {
      return vocabulary[currentLang][key] || key;
    };
  }

  var vocabularyEn = {
    USERNAME_OR_PASSWORD_IS_INCORRECT: 'The username or password is incorrect',
    LOGIN_PAGE_CONFIRM_YOUR_EMAIL_MESSAGE: 'We have sent you an email, please check your mailbox.',
    CONFIRM_YOUR_EMAIL: 'Confirm your email!',
    RESEND_CONFIRMATION: 'Resend confirmation',
    CANCEL: 'Cancel',
    FILE_IS_DOWNLOADED: 'file is downloaded in conversation with ',
    VIDEO_IS_WATCHED: 'video is watched in conversaion with ',
    VIDEO_IS_WATCHING: 'video is watching in conversation with ',
    CONVERSATION_IS_OPENED: 'conversation was opened by ',
    NEW_MESSAGE: 'new message from '
  };

  vocabulary = {
    en: vocabularyEn
  };
})(angular);
