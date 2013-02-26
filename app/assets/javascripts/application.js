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
var PlayList;

var Coachella = (function() {

  function CurrentlyPlayingView() {
    var self = this;

    self.library = null;
    self.playlist = PlayList;
    self.video = null;

    self.loadPlaylist = function() {
      $.getJSON("/playlists.json", function(data) {
        PlayList = data;
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
      video = self.playlist.shift();
      self.playlist.push(video);

      self.video.loadVideoById(video.url);
      self.nowPlaying(video);
    };

    self.loadNextVideo = function(event) {
      if (event.data === 0) {
        video = self.playlist.shift();
        self.playlist.push(video);

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
      self.playlist = PlayList;
      var songList = $("<ol>");
      var maxIter = Math.min(self.playlist.length - 1, 10);

      for (var i = 0; i<maxIter; i++) {
        var li = $("<li>");

        li.html("<strong>" + self.playlist[i].band + "</strong>: " + self.playlist[i].name);
        songList.append(li);
      }

      $("#current-playlist").html(songList);
    };

    self.initialize = (function() {
      var playlistCreator = new PlaylistCreatorView("#playlist-creator");
      var discovery = new DiscoveryView("#discovery");
      discovery.renderBandsIndex();

      self.loadPlaylist();
      $("#cue-playlist").click(self.loadIframe);
    })();
  }

  // Constructor to initialize views for 'discovery'

  function DiscoveryView(el) {
    var self = this;

    self.el = $(el);

    // views

    self.renderBandsIndex = function() {
      $.getJSON('/bands.json', function(data) {
        var source = $("#bands-index").html();
        var template = Handlebars.compile(source);
        var html = template({bands: data});

        self.el.html(html);
        
        self.bandsIndexListeners();
      });
    };

    self.renderBandsShow = function(id) {
      var pathname = '/bands/' + id + '.json';

      $.getJSON(pathname, function(data) {
        var source = $("#bands-show").html();
        var template = Handlebars.compile(source);
        var html = template({band: data});

        self.el.html(html);

        self.bandsShowListeners();
      });
    };

    // listeners

    self.bandsIndexListeners = function() {
      $(".bands-show").click(function() {
        var id = $(this).attr("data-band-id");

        self.renderBandsShow(id);
      });
    };

    self.bandsShowListeners = function() {
      $(".bands-index").click(function() {
        self.renderBandsIndex();
      });
    };
  }

  function PlaylistCreatorView(el) {
    var self = this;

    self.el = $(el);

    self.renderPlaylistsCreate = (function() {
      var source = $("#playlists-create").html();
      var template = Handlebars.compile(source);
      var html = template();

      self.el.html(html);

      $(".playlists-create").click(function() {
        $.post('playlists.json', $("#playlists-form").serialize(), function(data) {
          PlayList = data;
        });
      });
    })();
  }

  return {
    Player: CurrentlyPlayingView
  };

})();

function onYouTubeIframeAPIReady() {
  var player = new Coachella.Player();
}

$(function() {
  $.getScript("https://www.youtube.com/iframe_api");
});
