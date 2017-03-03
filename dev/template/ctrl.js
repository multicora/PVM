(function (angular) {
  var app = angular.module('app');

  app.controller('templateCtrl', ctrl);

  ctrl.$inject = [
    '$routeParams',
    '$scope',
    'conversationsService',
    'profileService',
    'libraryService'
  ];
  function ctrl(
    $routeParams,
    $scope,
    conversationsService,
    profileService,
    libraryService
  ) {
    var vm = this;
    vm.name = {};
    vm.companyRole = {};
    vm.message = {};
    vm.title = {};
    vm.showSendPopup = false;
    vm.showSelectPopup = false;
    vm.showSendHandler = false;

    if ($routeParams.templateId === 'null') {
      vm.videoId = $routeParams.id;
      getVideo(vm.videoId);
    } else {
      vm.templateId = $routeParams.templateId;
      getTemplate();
    }


    getProfile();
    getVideos();

    libraryService.getThumbnails().then(function (res) {
      for (let i = 0; i < res.data.data.length; i++) {
        vm.list[i].attributes.thumbnail = res.data.data[i].attributes;
      }
    });

    vm.edit = function(element) {
      element.editMode = true;
    }

    vm.save = function() {
      checkName();
      vm.sendData ={
        'name': vm.name.name,
        'company_role': vm.companyRole.role,
        'message': vm.message.message,
        'title': vm.title.title,
        'logo': vm.logo,
        'videoId': vm.videoId,
        'author': vm.user.id
      }

      if (vm.templateId) {
        vm.sendData.id = vm.templateId;
        conversationsService.updateTemplate(vm.sendData).then(function() {
          closeAllEditButton();
          getTemplate();
        });
      } else {
        if (!vm.name.name) {
          vm.name.name = vm.user.firstName;
        }
        if (!vm.companyRole.role) {
          vm.companyRole.role = vm.user.company_position;
        }
        conversationsService.createTemplate(vm.sendData).then(function(res) {
          closeAllEditButton();
          vm.templateId = res.data.templateId;
        });
      }
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
        'name': vm.name.name,
        'company_role': vm.companyRole.role,
        'message': vm.message.message,
        'title': vm.title.title,
        'logo': vm.logo,
        'videoId': vm.videoId,
        'email': email
      }
      conversationsService.create(vm.sendData).then(function () {
        vm.showSendPopup = false;
      });
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

    function getTemplate() {
      conversationsService.getTemplate(vm.templateId).then(function(res) {
        vm.name.name = res.data.name;
        vm.companyRole.role = res.data.companyRole;
        vm.message.message = res.data.message;
        vm.title.title = res.data.title;
        vm.logo = res.data.logo;
        vm.videoId = res.data.videoId;
        vm.media = {
          sources: [{
            src: res.data.videoUrl,
            type: 'video/mp4'
          }]
        };
      })
    }

    function closeAllEditButton() {
      vm.name.editMode = false;
      vm.companyRole.editMode = false;
      vm.title.editMode = false;
      vm.message.editMode = false;
    }

    function getProfile() {
      profileService.getProfile().then(function(res) {
        vm.user = res.data;
      });
    };

    function getVideos() {
      libraryService.getVideos().then(function (res) {
        vm.list = res.data.data;
      });
    };

    function getVideo(id) {
      conversationsService.getVideo(id).then(function(res) {
        vm.media = {
          sources: [{
            src: res.data.data.attributes.url,
            type: 'video/mp4'
          }]
        };
      });
    }

    function checkName() {
      if (!vm.name.name || vm.name.name === 'undefined' || vm.name.name === 'null') {
        vm.name.name = vm.user.firstName;
      }
      if (!vm.companyRole.role || vm.companyRole.role === 'undefined' || vm.companyRole.role === 'null') {
        vm.companyRole.role = vm.user.company_position;
      }
    }
  }
})(angular);