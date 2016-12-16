import Ember from 'ember';
import EmberUploader from 'ember-uploader';

export default EmberUploader.FileField.extend({
  uploadEnd: () => {},
  uploadStart: () => {},
  filesDidChange(files) {
    const uploadEndCb = this.get('uploadEnd');
    const uploadStartCb = this.get('uploadStart');

    const uploader = EmberUploader.Uploader.create({
      url: this.get('url')
    });

    if (!Ember.isEmpty(files)) {
      uploadStartCb();
      uploader.upload(files[0]).then(success, failure);
    }

    uploader.on('progress', e => {
      console.log('progress: ' + e.percent.toFixed(2) + '%');
    });

    function success() {
      console.log('finish');
      uploadEndCb();
    }

    function failure(error) {
      console.log('File uploading failure:');
      console.log(error);
      uploadEndCb();
    }
  }
});