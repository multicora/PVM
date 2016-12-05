import Ember from 'ember';

export default Ember.Component.extend({
  uploader: Ember.inject.service(),
  isShown: true,
  actions: {
    hidePopup() {
      this.toggleProperty('isShown');
    },
    uploadVideo() {
    },
    ready(player, component) {
      let uploader = this.get('uploader');
      player.on('finishRecord', function() {
        let audioFile = player.recordedData;

        uploader.video({
          file: audioFile.video
        }).then(
          () => {
            console.log('finish');
          },
          (error) => {
            console.log('File uploading failure:');
            console.log(error);
          }
        );

      });
    },
  },
  setup: {
    controls: true,
    width: 320,
    height: 240,
    plugins: {
      record: {
        audio: true,
        video: true,
        maxLength: 10,
        debug: true
      }
    }
  }
});