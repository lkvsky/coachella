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

  function CurrentlyPlayingView(playlist) {
    var self = this;

    self.el = $("#music-container");
    self.playlist = playlist;

    self.loadIframe = function() {
      if (self.playlist) {
        self.video = new YT.Player('music-player', {
          events: {
            'onReady': self.startPlaylist,
            'onStateChange': self.loadNextVideo
          }
        });
      }
    };

    self.startPlaylist = function() {
      var video = self.playlist.shift();
      self.playlist.push(video);

      self.video.loadVideoById(video.url);
      self.renderOnDeck();
    };

    self.loadNextVideo = function(event) {
      // event fired from YT Player that video has ended
      if (event.data === 0) {
        var video = self.playlist.shift();
        self.playlist.push(video);

        self.video.loadVideoById(video.url);
        self.renderOnDeck();
      }
    };

    self.renderOnDeck = function() {
      var source, template, html;

      if (self.playlist) {
        source = $("#cued-song").html();
        template = Handlebars.compile(source);
        html = template({song: self.playlist[0]});

        $("#on-deck").html(html);
      } else {
        source = $("#prompt-user").html();
        template = Handlebars.compile(source);
        html = template();

        $("#on-deck").html(html);

        $(".generate-random").click(function() {
          self.generateRandomPlaylist();
        });
      }
    };

    self.renderPlayerShow = function() {
      var source = $("#player-show").html();
      var template = Handlebars.compile(source);
      var html = template();

      self.el.html(html);
    };

    self.generateRandomPlaylist = function() {
      $.getJSON("/songs", function(data) {
        self.playlist = data;

        self.renderOnDeck();
      });
    };

    self.initialize = (function() {
      self.renderPlayerShow();
      self.renderOnDeck();
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

    // initialize

    self.initialize = (function() {
      self.renderBandsIndex();
    })();
  }

  function PlaylistCreatorView(el) {
    var self = this;

    self.el = $(el);

    // views

    self.renderPlaylistsIndex = function() {
      $.getJSON("/playlists.json", function(data) {
        var source = $("#playlists-index").html();
        var template = Handlebars.compile(source);
        var html = template({playlists: data});

        self.el.html(html);

        self.renderPlaylistsIndexListeners();
      });
    };

    self.renderPlaylistsForm = function() {
      var source = $("#playlists-create").html();
      var template = Handlebars.compile(source);
      var html = template();

      self.el.html(html);

      self.renderPlaylistsFormListeners();
    };

    self.renderPlaylistsShow = function(id) {
      var pathname = "/playlists/" + id + ".json";

      $.getJSON(pathname, function(data) {
        var source = $("#playlists-show").html();
        var template = Handlebars.compile(source);
        var html = template({playlist: data});

        self.el.html(html);

        self.renderPlaylistsShowListeners();
      });
    };

    // listeners

    self.renderPlaylistsFormListeners = function() {
      $(".playlists-create").click(function() {
        $.post('playlists.json', $("#playlists-form").serialize(), function(data) {
          self.renderPlaylistsIndex();
        });
      });

      self.indexPlaylist();
    };

    self.renderPlaylistsIndexListeners = function() {
      self.loadPlaylist();
      self.newPlaylist();
      self.showPlaylist();
    };

    self.renderPlaylistsShowListeners = function() {
      self.loadPlaylist();
      self.newPlaylist();
      self.indexPlaylist();
      self.deletePlaylist();
    };

    // listener helpers

    self.showPlaylist = function() {
      $(".playlists-show").click(function() {
        var id = $(this).attr("data-playlist-id");

        self.renderPlaylistsShow(id);
      });
    };

    self.newPlaylist = function() {
      $(".playlists-new").click(function() {
        self.renderPlaylistsForm();
      });
    };

    self.deletePlaylist = function() {
      $(".playlists-delete").click(function() {
        var id = $(this).attr("data-playlist-id");
        var pathname = "/playlists/" + id;

        $.ajax({
          url: pathname,
          type: "delete"
        });

        self.renderPlaylistsIndex();
      });
    };

    self.indexPlaylist = function() {
      $(".playlists-index").click(function() {
        self.renderPlaylistsIndex();
      });
    };

    self.loadPlaylist = function() {
      $(".load-playlist").click(function() {
        var id = $(this).attr("data-playlist-id");
        var pathname = "/playlists/" + id + ".json";

        $.getJSON(pathname, function(data) {
          new CurrentlyPlayingView(data.songs);
        });
      });
    };

    self.initialize = (function() {
      self.renderPlaylistsIndex();
    })();
  }

  return {
    CurrentlyPlayingView: CurrentlyPlayingView,
    PlaylistCreatorView: PlaylistCreatorView,
    DiscoveryView: DiscoveryView
  };

})();

function onYouTubeIframeAPIReady() {
  var player = new Coachella.CurrentlyPlayingView();
  var playlistCreator = new Coachella.PlaylistCreatorView("#playlist-creator");
  var discovery = new Coachella.DiscoveryView("#discovery");
}

$(function() {
  $.getScript("https://www.youtube.com/iframe_api");
});
