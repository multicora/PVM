(function (angular) {
  var app = angular.module('app');

  app.controller('templateCtrl', ctrl);

  ctrl.$inject = [
    '$routeParams',
    '$scope',
    '$location',
    '$mdToast',
    'conversationsService',
    'profileService',
    'libraryService'
  ];
  function ctrl(
    $routeParams,
    $scope,
    $location,
    $mdToast,
    conversationsService,
    profileService,
    libraryService
  ) {
    var vm = this;
    vm.nameObj = {};
    vm.companyRole = {};
    vm.messageObj = {};
    vm.titleObj = {};
    vm.showSendPopup = false;
    vm.showSelectPopup = false;
    vm.showSendButton = false;

    vm.videoId = $routeParams.videoId;
    getVideo(vm.videoId);

    getProfile();
    getVideos();

    libraryService.getThumbnails().then(function (res) {
      for (let i = 0; i < res.data.length; i++) {
        vm.list[i].attributes.thumbnail = res.data[i].attributes;
      }
    });

    vm.edit = function(element) {
      element.editMode = true;
    }

    vm.save = function() {
      checkName();
      vm.sendData ={
        'name': vm.nameObj.name,
        'company_role': vm.companyRole.role,
        'message': vm.messageObj.message,
        'title': vm.titleObj.title,
        'logo': vm.logo,
        'videoId': vm.videoId,
        'author': vm.user.id
      }

      if (!vm.nameObj.name) {
        vm.nameObj.name = vm.user.name;
      }
      if (!vm.companyRole.role) {
        vm.companyRole.role = vm.user.company_position;
      }
      conversationsService.createTemplate(vm.sendData).then(function(res) {
        $mdToast.showSimple('Saved successfully!');
        $location.path('template-edit/' + res.data.templateId);
      });
    }

    vm.onThumbnailClick = function(video) {
      vm.videoId = video.id;
      vm.showSelectPopup = false;
      getVideo(vm.videoId);
    }

    vm.closeSelectPopup = function() {
      vm.showSelectPopup = false;
    }

    vm.closeSendPopup = function() {
      vm.showSendPopup = false;
    }

    vm.sendVideo = function(email) {
      checkName();
      vm.sendData ={
        'name': vm.nameObj.name,
        'company_role': vm.companyRole.role,
        'message': vm.messageObj.message,
        'title': vm.titleObj.title,
        'logo': vm.logo,
        'videoId': vm.videoId,
        'email': email
      }
      conversationsService.create(vm.sendData).then(function () {
        $mdToast.showSimple('Sended successfully!');
        vm.showSendPopup = false;
      });
    }

    vm.back = function () {
      $location.path('library');
    }

    $scope.convertToBase64LogoTemplate = function(event) {
      var f = document.getElementById('logo').files[0],
          r = new FileReader(),
          size = (f.size >= 524288),
          type = (f.type.indexOf('image') >= 0);
      if (size || !type) {

        vm.logoError = 'File is too large or isn`t image, please choose another file!';
      } else {
        vm.logoError = '';
        r.onloadend = function(e) {
          // TODO: converted to base64 image
          vm.logo = e.target.result;
          $scope.$digest();
        }
        r.readAsDataURL(f);
      }
      $scope.$apply();
    }

    function closeAllEditButton() {
      vm.nameObj.editMode = false;
      vm.companyRole.editMode = false;
      vm.titleObj.editMode = false;
      vm.messageObj.editMode = false;
    }

    function getProfile() {
      profileService.getProfile().then(function(res) {
        vm.user = res.data;
        vm.user.name = res.data.firstName + ' ' +res.data.secondName;
      });
    };

    function getVideos() {
      libraryService.getVideos().then(function (res) {
        vm.list = res.data;
      });
    };

    function getVideo(id) {
      conversationsService.getVideo(id).then(function(res) {
        vm.media = {
          sources: [{
            src: res.data.attributes.url,
            type: 'video/mp4'
          }]
        };
      });
    }

    function checkName() {
      if (!vm.nameObj.name || vm.nameObj.name === 'undefined' || vm.nameObj.name === null) {
        vm.nameObj.name = vm.user.name;
      }
      if (!vm.companyRole.role || vm.companyRole.role === 'undefined' || vm.companyRole.role === null) {
        vm.companyRole.role = vm.user.company_position;
      }
    }
  }
})(angular);
