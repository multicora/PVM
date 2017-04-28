(function (angular) {
  var app = angular.module('app');

  app.controller('templateCtrl', ctrl);

  ctrl.$inject = [
    '$routeParams',
    '$scope',
    '$location',
    '$mdToast',
    'conversationsService',
    'uploadRecordPopupService',
    'profileService',
    'libraryService',
    'Socialshare'
  ];
  function ctrl(
    $routeParams,
    $scope,
    $location,
    $mdToast,
    conversationsService,
    uploadRecordPopupService,
    profileService,
    libraryService,
    Socialshare
  ) {
    var vm = this;
    vm.nameObj = {};
    vm.companyRole = {};
    vm.messageObj = {};
    vm.titleObj = {};
    vm.showSendPopup = false;
    vm.showSelectPopup = false;
    vm.showSendButton = false;
    vm.templateId = null;
    vm.videoId = null;

    if ($routeParams.templateId) {
      vm.templateId = $routeParams.templateId;
      getTemplate();
    } else {
      vm.videoId = $routeParams.video;
      getVideo(vm.videoId);
    }
    getProfile();

    vm.getVideos = function() {
      libraryService.getVideos().then(function (res) {
        vm.list = res.data;
        return libraryService.getThumbnails();
      }).then(function (res) {
        for (let i = 0; i < res.data.length; i++) {
          vm.list[i].attributes.thumbnail = res.data[i].attributes;
        }
      });
    };

    vm.getVideos();

    vm.edit = function(element) {
      element.editMode = true;
    }

    vm.save = function() {
      checkName();
      vm.sendData = {
        'name': vm.nameObj.name,
        'company_role': vm.companyRole.role,
        'message': vm.messageObj.message,
        'title': vm.titleObj.title,
        'logo': vm.logo,
        'videoId': vm.videoId,
        'author': vm.user.id
      };

      if (vm.templateId) {
        // Edit
        vm.sendData.id = vm.templateId;
        conversationsService.updateTemplate(vm.sendData).then(function() {
          closeAllEditButton();
          getTemplate();
          $mdToast.show(
            $mdToast.simple()
              .textContent('Saved successfully!')
              .position('bottom center')
              .hideDelay(3000)
          );
        }).catch(function (err) {
          // TODO: add error style
          $mdToast.show(
            $mdToast.simple()
              .textContent(err.data.error)
              .position('bottom center')
              .hideDelay(3000)
          );
        });
      } else {
        // Create
        if (!vm.nameObj.name) {
          vm.nameObj.name = vm.user.name;
        }
        if (!vm.companyRole.role) {
          vm.companyRole.role = vm.user.company_position;
        }
        conversationsService.createTemplate(vm.sendData).then(function(res) {
          $mdToast.show(
            $mdToast.simple()
              .textContent('Saved successfully!')
              .position('bottom center')
              .hideDelay(3000)
          );
          $location.path('template/' + res.data.templateId);
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
        'name': vm.nameObj.name,
        'company_role': vm.companyRole.role,
        'message': vm.messageObj.message,
        'title': vm.titleObj.title,
        'logo': vm.logo,
        'videoId': vm.videoId,
        'email': email
      }
      conversationsService.create(vm.sendData).then(function () {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Sended successfully!')
            .position('bottom center')
            .hideDelay(3000)
        );
        vm.showSendPopup = false;
      });
    }

    vm.back = function () {
      $location.path('library');
    }

    vm.shareFacebook = function () {
      createPublicConversation().then(function(res) {
        Socialshare.share({
          'provider': 'facebook',
          'attrs': {
            'socialshareUrl': res.data.link
          }
        });
      });
    }

    vm.shareLinkedin = function () {
      createPublicConversation().then(function(res) {
        Socialshare.share({
          'provider': 'linkedin',
          'attrs': {
            'socialshareUrl': res.data.link
          }
        });
      });
    }

    vm.shareTwitter = function () {
      createPublicConversation().then(function(res) {
        Socialshare.share({
          'provider': 'twitter',
          'attrs': {
            'socialshareUrl': res.data.link
          }
        });
      });
    }

    vm.shareViber = function () {
      createPublicConversation().then(function(res) {
        Socialshare.share({
          'provider': 'whatsapp',
          'attrs': {
            'socialshareUrl': res.data.link
          }
        });
      });
    }

    vm.uploadBtnClick = function () {
      uploadRecordPopupService.showUploadPopup();
    }

    vm.recordBtnClick = function () {
      uploadRecordPopupService.showRecordPopup();
    };

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

    function createPublicConversation() {
      return new Promise(function (resolve, reject) {
        vm.sendData ={
          'name': vm.nameObj.name,
          'company_role': vm.companyRole.role,
          'message': vm.messageObj.message,
          'title': vm.titleObj.title,
          'logo': vm.logo,
          'videoId': vm.videoId,
          'email': null
        }

        conversationsService.createPublic(vm.sendData).then(function (res) {
          resolve(res);
        }, function (err) {
          reject(err);
        });
      });
    }

    function getTemplate() {
      conversationsService.getTemplate(vm.templateId).then(function(res) {
        vm.nameObj.name = res.data.name;
        vm.companyRole.role = res.data.companyRole;
        vm.messageObj.message = res.data.message;
        vm.titleObj.title = res.data.title;
        vm.logo = res.data.logo;
        vm.videoId = res.data.videoId;
        vm.media = {
          sources: [{
            src: res.data.videoUrl,
            type: 'video/mp4'
          }]
        };
      }).catch(function (res) {
        // TODO: add error style
        // TODO: add 404 page
        $mdToast.show(
          $mdToast.simple()
            .textContent(res.data.error)
            .position('bottom center')
            .hideDelay(3000)
        );
      });
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
