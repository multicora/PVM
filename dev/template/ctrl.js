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
    vm.media = null;

    getTemplate();
    getProfile();
    getVideos();

    vm.edit = function(element) {
      element.editMode = true;
    }

    vm.save = function() {
      if (!vm.name.name) {
        vm.name.name = vm.user.firstName;
      }
      if (!vm.companyRole.role) {
        vm.companyRole.role = vm.user.company_position;
      }
      console.log(vm.name.name, vm.companyRole.role);
      conversationsService.updateTemplate({
        'id': $routeParams.id,
        'name': vm.name.name,
        'company_role': vm.companyRole.role,
        'message': vm.message.message,
        'title': vm.title.title,
        'logo': vm.logo,
        'videoId': vm.videoId
      }).then(function() {
        vm.name.editMode = false;
        vm.companyRole.editMode = false;
        vm.title.editMode = false;
        vm.message.editMode = false;
      });
    }

    // Send
    vm.closeSendPopup = function () {
      vm.showSendPopup = false;
    }

    vm.sendVideo = function (email) {
      conversationsService.create(email, vm.video).then(function () {
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
      conversationsService.getTemplate($routeParams.id).then(function(res) {
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
  }
})(angular);