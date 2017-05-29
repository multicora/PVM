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
    'Socialshare',
    'templateService',
    'filesService'
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
    Socialshare,
    templateService,
    filesService
  ) {
    var vm = this;
    vm.nameObj = {};
    vm.companyRole = {};
    vm.messageObj = {};
    vm.titleObj = {};
    vm.showSendPopup = false;
    vm.showSelectPopup = false;
    vm.closeSelectFilePopup = false;
    vm.showSendButton = false;
    vm.templateId = null;
    vm.videoId = null;
    vm.files = [];

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
        vm.videoList = res.data;
      });
    };

    vm.getVideos();

    vm.edit = function(element) {
      element.editMode = true;
    }

    vm.save = function() {
      checkName();

      vm.sendData = {
        'name': vm.nameObj.name || '',
        'company_role': vm.companyRole.role || '',
        'message': vm.messageObj.message || '',
        'title': vm.titleObj.title || '',
        'logo': vm.logo || '',
        'videoId': vm.videoId,
        'author': vm.user.id,
        'files': getFilesId(vm.files)
      };

      if (vm.templateId) {
        // Edit
        vm.sendData.id = vm.templateId;
        templateService.updateTemplate(vm.sendData).then(function() {
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
        templateService.createTemplate(vm.sendData).then(function(res) {
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

    vm.closeSelectFilePopup = function() {
      vm.showSelectFilePopup = false;
    }

    vm.closeSendPopup = function() {
      vm.showSendPopup = false;
    }

    vm.sendTemplate = function(email) {
      checkName();

      vm.sendData = {
        'name': vm.nameObj.name || '',
        'company_role': vm.companyRole.role || '',
        'message': vm.messageObj.message || '',
        'title': vm.titleObj.title || '',
        'logo': vm.logo || '',
        'videoId': vm.videoId,
        'files': getFilesId(vm.files),
        'email': email
      }
      conversationsService.create(vm.sendData).then(function () {
        vm.showSendPopup = false;
        $mdToast.show(
          $mdToast.simple()
            .textContent('Sended successfully!')
            .position('bottom center')
            .hideDelay(3000)
        );
        $location.path('/library');
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

    vm.uploadBtnClick = function () {
      uploadRecordPopupService.showUploadPopup();
    }

    vm.recordBtnClick = function () {
      uploadRecordPopupService.showRecordPopup();
    };

    vm.onUseFileClick = function(id) {
      vm.showSelectFilePopup = false;

      if (vm.files.length <= 3) {
        vm.filesList.forEach( function ( file ) {
          if (file.id === id) {
            vm.files.push(file);
          }
        });
      }

      return vm.files;
    };

    vm.deleteFile = function(index) {
      vm.files.splice(index, 1);
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
        vm.sendData = {
          'name': vm.nameObj.name || '',
          'company_role': vm.companyRole.role || '',
          'message': vm.messageObj.message || '',
          'title': vm.titleObj.title || '',
          'logo': vm.logo || '',
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

    function getTemplateFiles (arr) {
      vm.files = [];
      arr.forEach( function(id) {
        vm.filesList.forEach( function(file) {
          if (file.id === id) {
            vm.files.push(file);
          }
        });
      });
    }

    function getTemplate() {
      templateService.getTemplate(vm.templateId).then(function(res) {
        vm.nameObj.name = res.data.name;
        vm.companyRole.role = res.data.companyRole;
        vm.messageObj.message = res.data.message;
        vm.titleObj.title = res.data.title;
        vm.logo = res.data.logo;
        vm.videoId = res.data.videoId;
        vm.filesArr = res.data.files;
        vm.media = {
          sources: [{
            src: res.data.videoUrl,
            type: 'video/mp4'
          }]
        };

        return filesService.getFiles();
      }).then(function(res) {

        vm.filesList = res;
        getTemplateFiles(vm.filesArr);
      }).catch(function (err) {
        // TODO: add error style
        // TODO: add 404 page
        $mdToast.show(
          $mdToast.simple()
            .textContent(err.data.error)
            .position('bottom center')
            .hideDelay(3000)
        );
      });
    }

    function getFilesId(files) {
      var arr = [];

      files.forEach( function (file) {
        arr.push(file.id);
      });

      return arr;
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
