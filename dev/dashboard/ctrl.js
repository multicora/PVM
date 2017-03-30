(function (angular) {
  var app = angular.module('app');

  app.controller('dashboardCtrl', ctrl);

  ctrl.$inject = [
    'conversationsService',
    'uploadService',
  ];
  function ctrl(
    conversationsService,
    uploadService
  ) {
    var vm = this;
    vm.showRecordPopup = false;
    vm.showUploadPopup = false;
    vm.sentConversation = 0;
    vm.openedConversation = 0;

    getConversation();

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

      vm.config = {
        "labels": false,
        "title": '',
        "innerRadius": "",
        "lineLegend": "lineEnd"
      }
      vm.data = {
        series: ["Sent", "Opened"],
        data: [{
          "x": "Sent",
          "y": [
            vm.sentConversation
          ],
          "tooltip": "Sent"
        },
        {
          "x": "Opened",
          "y": [
            vm.openedConversation
          ],
          "tooltip": "Opened"
        }
        ]
      };
      });
    }
  }
})(angular);