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

    self.loadIframe = function() {
      self.video = new YT.Player('music-player', {
        events: {
          'onReady': self.cueVideo,
          'onStateChange': self.loadVideo
        }
      });
    };

    self.cueVideo = function() {
      video = self.playlist.pop();
      self.playlist.splice(0, 0, video);

      self.video.cueVideoById(video.url);
      self.nowPlaying(video);
    };

    self.loadVideo = function(event) {
      if (event.data === 0) {
        video = self.playlist.pop();
        self.playlist.splice(0, 0, video);

        self.video.loadVideoById(video.url);
        self.nowPlaying(video);
      }

      self.renderPlaylist();
    };

    self.nowPlaying = function(video) {
      var currentVid = $("<div>");
      var about = $("<div>");

      currentVid.addClass("well");
      currentVid.append(about);
      about.html("<strong>" + video.name + "</strong>");

      $("#now-playing").html(currentVid);
    };

    self.renderPlaylist = function() {
      var songList = $("<ol>");
      var maxIter = Math.min(self.playlist.length - 1, 10);

      for (var i = maxIter; i>0; i--) {
        var li = $("<li>");

        li.html(self.playlist[i].name);
        songList.append(li);
      }

      $("#current-playlist").html(songList);
    };

    self.initialize = (function() {
      self.renderPlaylist();
      $("#cue-playlist").click(self.loadIframe);
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
