// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .
var Coachella = (function() {

  function Player() {
    var self = this;

    self.playlist = SongData;
    self.video = null;

    self.loadVideo = function() {
      video = self.playlist.pop();
      self.playlist.splice(0, 0, video);

      self.video.loadVideoById(video.url);
    };

    self.cueVideo = function(event) {
      if (event.data === 0) {
        self.loadVideo();
      }
    };

    self.loadIframe = (function() {
      self.video = new YT.Player('music-player', {
        events: {
          'onReady': self.loadVideo,
          'onStateChange': self.cueVideo
        }
      });
    })();
  }

  return {
    Player: Player
  };

})();

function onYouTubeIframeAPIReady() {
  var player = new Coachella.Player();
}

$(function() {
  $.getScript("https://www.youtube.com/iframe_api");
});
