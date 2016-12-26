import Ember from 'ember';

export default Ember.Component.extend({
  uploader: Ember.inject.service(),
  isShown: false,
  isUploading: false,
  disabledButton: true,
  audioFile: null,
  actions: {
    hidePopup() {
      this.toggleProperty('isShown');
    },
    saveVideo() {
      let audioFile =this.get('audioFile');
      let uploader = this.get('uploader');
      uploader.video({
        file: audioFile.video
      }).then(
        () => {
          console.log('finish');
        },
        (error) => {
          this.set('errorMessage', 'File uploading failure:' + error);
          console.log(error);
        }
      );
    },
    ready(player) {
      let self = this;
      player.on('finishRecord', function() {
        self.set('disabledButton', false);
        self.set('audioFile', player.recordedData);
      });

      player.on('startRecord', function() {
        self.set('disabledButton', true);
      });
    },
  },
  setup: {
    controls: true,
    width: 640,
    height: 480,
    plugins: {
      record: {
        audio: true,
        video: true,
        maxLength: 120,
        debug: true
      }
    },
    controlBar: {
      volumeMenuButton: false,
      fullscreenToggle: false
    }
  }
});