(function (angular) {
  var app = angular.module('app');

  app.controller('dashboardCtrl', ctrl);

  ctrl.$inject = [
    '$scope',
    '$location',
    'conversationsService',
    'uploadService',
  ];
  function ctrl(
    $scope,
    $location,
    conversationsService,
    uploadService
  ) {
    var vm = this;
    vm.showRecordPopup = false;
    vm.showUploadPopup = false;
    vm.sentConversation = 0;
    vm.openedConversation = 0;
    vm.messages;

    getConversation();
    conversationsService.getChatForDashboard().then(function (res) {
      vm.messages = res.data;

      var length = vm.messages.length;
      for (var i = 0; i < length - 1; i++) {
        for (var j = 0; j < length - 1 - i; j++) {
          if (vm.messages[j+1].date > vm.messages[j].date) {
            var first = vm.messages[j+1];
            vm.messages[j+1] = vm.messages[j];
            vm.messages[j] = first;
          }
        }
      }

      vm.messages = vm.messages.slice(0, 5);
      for (var i = 0; i < vm.messages.length; i++) {
        var date = new Date();
        vm.messages[i].date = new Date(vm.messages[i].date);

        vm.messages[i].passedTime = date.getTime() - vm.messages[i].date.getTime();

        if (vm.messages[i].passedTime < 360000) {
          vm.messages[i].passedTime = new Date(vm.messages[i].passedTime).getMinutes() + 'min';
        } else if (vm.messages[i].passedTime < 86400000) {
          vm.messages[i].passedTime = new Date(vm.messages[i].passedTime).getHours() + 'hrs';
        } else if (vm.messages[i].passedTime){
          vm.messages[i].passedTime = new Date(vm.messages[i].passedTime).getDays() + 'days';
        }
      }

    });

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
    };

    vm.redirectToConversation = function (id) {
      $location.path('conversation/' + id);
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