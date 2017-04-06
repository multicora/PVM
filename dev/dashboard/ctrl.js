(function (angular) {
  var app = angular.module('app');

  app.controller('dashboardCtrl', ctrl);

  ctrl.$inject = [
    '$scope',
    'conversationsService',
    'uploadService',
  ];
  function ctrl(
    $scope,
    conversationsService,
    uploadService
  ) {
    var vm = this;
    vm.showRecordPopup = false;
    vm.showUploadPopup = false;
    vm.sentConversation = 0;
    vm.openedConversation = 0;

    getConversation();

    vm.configMessage = {
      "labels": false,
      "title": '',
      "innerRadius": '45',
      "colors" : ['#2196F3', '#E3F2FD']
    }

    // Will be using when will be implemented video watched notificatio
    // vm.configVideo = {
    //   "labels": false,
    //   "title": '',
    //   "innerRadius": '39',
    //   "colors" : ['#8BC34A', '#F1F8E9']
    // }

    // Rocord popup
    vm.recordBtnClick = function () {
      vm.showRecordPopup = true;
    };

    vm.closeRecordPopup = function () {
      vm.showRecordPopup = false;
    };

    vm.finishRecord = function (data) {
      vm.recordedData = data;
    };

    vm.sendRecordClick = function (name) {
      name = name || 'no name';
      uploadService.sendFile(
        "/api/video",
        vm.recordedData.video,
        name + '.wmv'
      ).then(function () {
        vm.closeRecordPopup();
        vm.videoName = null;
      });
    };

    // Upload popup
    vm.uploadBtnClick = function () {
      vm.showUploadPopup = true;
    };

    vm.closeUploadPopup = function () {
      vm.showUploadPopup = false;
    };

    vm.uploadEnd = function () {
      vm.closeUploadPopup();
    }

    function getConversation() {
      conversationsService.getByAuthor().then(function (res) {
        vm.conversations = res.data;

        vm.sentConversation = vm.conversations.length;
        vm.conversations.map(function(conversation) {
          if (conversation.viewed) {
            vm.openedConversation++;
          }
        });

        vm.data = {
          series: ["Sent", "Opened"],
          data: [{
            "x": "Sent",
            "y": [
              50
            ],
            "tooltip": "Sent"
          },
          {
            "x": "Opened",
            "y": [
              10
            ],
            "tooltip": "Opened"
          }]
        };
      });
    }
  }
})(angular);