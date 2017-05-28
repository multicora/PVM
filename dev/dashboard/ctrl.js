(function (angular) {
  var app = angular.module('app');

  app.controller('dashboardCtrl', ctrl);

  ctrl.$inject = [
    '$scope',
    '$location',
    'conversationsService',
    'uploadRecordPopupService',
    'uploadService',
  ];
  function ctrl(
    $scope,
    $location,
    conversationsService,
    uploadRecordPopupService,
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
      // TODO: move to separate function
      // TODO: use "[].sort()" function 
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

      // TODO: move to separate function
      vm.messages = vm.messages.slice(0, 5);
      for (var i = 0; i < vm.messages.length; i++) {
        var date = new Date();
        vm.messages[i].date = new Date(vm.messages[i].date);

        vm.messages[i].passedTime = date.getTime() - vm.messages[i].date.getTime();

        vm.messages[i].passedTime = formatTime(vm.messages[i].passedTime);
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

    vm.uploadBtnClick = function () {
      uploadRecordPopupService.showUploadPopup();
    }

    vm.recordBtnClick = function () {
      uploadRecordPopupService.showRecordPopup();
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
        vm.getVideos();
        vm.videoName = null;
        $mdToast.show(
          $mdToast.simple()
            .textContent('Video saved!')
            .position('bottom center')
        );
      });
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

    function formatTime (time) {
      if (time < 60000) {
        time = new Date(time).getSeconds() + ' sec';
      } else if (time < 3600000) {
        time = new Date(time).getMinutes() + ' min';
      } else if (time < 86400000) {
        time = new Date(time).getHours() + ' hrs';
      } else if (time) {
        time = new Date(time).getDay() + ' days';
      }

      return time;
    }
  }
})(angular);