import Ember from 'ember';
import EmberUploader from 'ember-uploader';

export default Ember.Service.extend({
  url: '/video',
  video(config) {
      const url = this.url;
      // TODO: change this to promise
      const progressCb = config.progressCb || (() => {});
      const file = config.file;

      const uploader = EmberUploader.Uploader.create({
        url
      });
      uploader.on('progress', e => {
        progressCb( e.percent.toFixed(2) );
      });

      return uploader.upload(file);
  }
});
