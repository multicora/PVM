(function (angular) {
  'use strict';
  angular.module('app').component('recordPopup', {
    templateUrl: 'components/recordPopup/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      getVideos: '&'
    }
  });

  ctrl.$inject = [
    '$mdToast',
    '$rootScope',
    'uploadService',
    'uploadRecordPopupService',
    'conversationsService'
  ];
  function ctrl(
    $mdToast,
    $rootScope,
    uploadService,
    uploadRecordPopupService,
    conversationsService
  ) {
    var vm = this;
    vm.recordedData = null;
    vm.media = null;

    vm.closeRecordPopup = function () {
      uploadRecordPopupService.hideRecordPopup();
    };

    vm.finishRecord = function (data) {
      vm.recordedData = data;
    };

    vm.sendRecordClick = function (name) {
      name = name || 'no name';

      uploadService.sendFile(
        '/api/video',
        vm.recordedData.video,
        name + '.wmv'
      ).then(function (res) {

        return conversationsService.getVideo(res.data.insertId);
      }).then(function(res) {
        vm.media = res.data.attributes.url;
        vm.videoIdThumbnail = res.data.id
      }).catch(function (err) {
        // TODO: add error style
        $mdToast.show(
          $mdToast.simple()
            .textContent(err.data.error)
            .position('bottom center')
            .hideDelay(3000)
        );
      });

      vm.generatedThumbnail = function() {
        vm.getVideos();
        vm.videoName = null;
        vm.closeRecordPopup();
        $mdToast.show(
          $mdToast.simple()
            .textContent('Video saved successfully!')
            .position('bottom center')
            .hideDelay(3000)
        );
      }
    };
  }
})(angular);
