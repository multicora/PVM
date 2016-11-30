import Ember from 'ember';
// import Record from 'npm:videojs-record';
export default Ember.Component.extend({
	isShown: true,
  actions: {
    hidePopup() {
      this.toggleProperty('isShown');
    },
    uploadVideo() {
      
    }
  },
	// player: {
 //    controls: true,
 //    loop: false,
 //    // dimensions of video.js player
 //    width: 100,
 //    height: 200,
 //    plugins: {
 //      record: {
 //        maxLength: 5,
 //        debug: true,
 //        audio: false,
 //        video: {
 //          // video constraints: set resolution of camera
 //          mandatory: {
 //            minWidth: 100,
 //            minHeight: 200,
 //          },
 //        },
 //        // dimensions of captured video frames
 //        frameWidth: 100,
 //        frameHeight: 200
	//     }
	//   }
	//  }
});
