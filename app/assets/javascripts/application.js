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

    self.library = null;
    self.playlist = [];
    self.video = null;

    self.loadPlaylist = function() {
      $.getJSON("/playlists.json", function(data) {
        self.playlist = data;
        self.renderPlaylist();
      });
    };

    self.loadIframe = function() {
      self.video = new YT.Player('music-player', {
        events: {
          'onReady': self.startPlaylist,
          'onStateChange': self.loadNextVideo
        }
      });
    };

    self.startPlaylist = function() {
      video = self.playlist.pop();
      self.playlist.splice(0, 0, video);

      self.video.loadVideoById(video.url);
      self.nowPlaying(video);
    };

    self.loadNextVideo = function(event) {
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
      about.html("<strong>Now Playing</strong> " + video.band + ", '" + video.name + "'");

      $("#now-playing").html(currentVid);
    };

    self.renderPlaylist = function() {
      var songList = $("<ol>");
      var maxIter = Math.min(self.playlist.length - 1, 10);

      for (var i = maxIter; i>0; i--) {
        var li = $("<li>");

        li.html("<strong>" + self.playlist[i].band + "</strong>: " + self.playlist[i].name);
        songList.append(li);
      }

      $("#current-playlist").html(songList);
    };

    self.initialize = (function() {
      self.loadPlaylist();
      var router = new Router("#yield");
      router.renderPlaylistCreate();
      $("#cue-playlist").click(self.loadIframe);
    })();
  }

  function Router(el) {
    var self = this;

    self.el = $(el);

    self.renderBandsIndex = function() {
      $.getJSON('/bands.json', function(data) {
        var source = $("#bands-index").html();
        var template = Handlebars.compile(source);
        var html = template({bands: data});

        self.el.html(html);
        
        $(".band-show").click(function() {
          var id = $(this).attr("data-band-id");

          self.renderBandShow(id);
        });
      });
    };

    self.renderBandShow = function(id) {
      var pathname = '/bands/' + id + '.json';

      $.getJSON(pathname, function(data) {
        var source = $("#band-show").html();
        var template = Handlebars.compile(source);
        var html = template({band: data});

        self.el.html(html);

        $(".band-index").click(function() {
          self.renderBandsIndex();
        });
      });
    };

    self.renderPlaylistCreate = function() {
      var source = $("#playlists-create").html();
      var template = Handlebars.compile(source);
      var html = template();

      self.el.html(html);

      $(".playlists-create").click(function() {
        $.post('playlists.json', $("#playlist-form").serialize(), function(data) {
          console.log(data);
        });
      });
    };
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
