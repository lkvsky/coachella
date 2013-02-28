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

  var handlebarsHelper = function(el, obj) {
    var html;
    var source = $(el).html();
    var template = Handlebars.compile(source);

    if (obj) {
      html = template(obj);
    } else {
      html = template();
    }

    return html;
  };

  function CurrentlyPlayingView(playlist) {
    var self = this;

    self.el = $("#music-container");
    self.playlist = playlist;

    // views

    self.renderPromptUserView = function() {
      html = handlebarsHelper("#prompt-user");
      
      $("#on-deck").html(html);
      $(".generate-random").click(function() {
        self.generateRandomPlaylist();
      });
    };

    self.renderCurrentSong = function() {
      var html, song;

      if (self.video) {
        var url = self.video.getVideoUrl().split("v=")[1];

        for (var i=0; i<self.playlist.length; i++) {
          if (url == self.playlist[i].url) {
            song = self.playlist[i];
          }
        }

        html = handlebarsHelper("#cued-song", {song: song});
      }

      $("#on-deck").html(html);
      self.updateFeelings(song.like, song.dislike);
      self.installCuedSongListeners();
    };

    self.renderPlayerShow = function() {
      var html = handlebarsHelper("#player-show");

      self.el.html(html);
    };

    // functionality

    self.loadIframe = function() {
      if (self.playlist) {
        self.video = new YT.Player('music-player', {
          events: {
            'onReady': self.startPlaylist,
            'onStateChange': self.renderCurrentSong
          }
        });

        self.video.setLoop(true);
      }
    };

    self.startPlaylist = function() {
      var playerList = [];

      for (var i=0; i<self.playlist.length; i++) {
        playerList.push(self.playlist[i].url);
      }

      self.video.loadPlaylist({playlist: playerList});
    };

    self.generateRandomPlaylist = function() {
      $.getJSON("/songs", function(data) {
        self.playlist = data;

        self.loadIframe();
      });
    };


    self.installCuedSongListeners = function() {
      $(".like").click(function() {
        var songId = $(this).attr("data-song-id");
        self.postLike(songId);
      });

      $(".dislike").click(function() {
        var songId = $(this).attr("data-song-id");
        self.postDislike(songId);
      });

    };

    // listener helpers

    self.postLike = function(songId) {
      $.post("/song_likes", {"like": songId}, function(data) {
        self.updateFeelings(data.like, data.dislike);
      });
    };

    self.postDislike = function(songId) {
      $.post("/song_dislikes", {"dislike": songId}, function(data) {
        self.updateFeelings(data.like, data.dislike);
      });
    };

    self.updateFeelings = function(likeStatus, dislikeStatus) {
      if (likeStatus) {
        $(".feelings").find(".like").html("UNLIKE");
      } else {
        $(".feelings").find(".like").html("LIKE");
      }

      if (dislikeStatus) {
        $(".feelings").find(".dislike").html("UNHATE");
      } else {
        $(".feelings").find(".dislike").html("LOATHE");
      }
    };

    self.initialize = (function() {
      self.renderPlayerShow();
      if (self.playlist) {
        self.loadIframe();
      } else {
        self.renderPromptUserView();
      }
    })();
  }

  // Constructor to initialize views for 'discovery'

  function DiscoveryView(el) {
    var self = this;

    self.el = $(el);

    // views

    self.renderBandsIndex = function() {
      $.getJSON('/bands.json', function(data) {
        var html = handlebarsHelper("#bands-index", {bands: data});

        self.el.html(html);
        
        self.installBandsIndexListeners();
      });
    };

    self.renderBandsShow = function(id) {
      var pathname = '/bands/' + id + '.json';

      $.getJSON(pathname, function(data) {
        var html = handlebarsHelper("#bands-show", {band: data});

        self.el.html(html);

        self.installBandsShowListeners();
      });
    };

    // listeners

    self.installBandsIndexListeners = function() {
      $(".bands-show").click(function() {
        var id = $(this).attr("data-band-id");

        self.renderBandsShow(id);
      });
    };

    self.installBandsShowListeners = function() {
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
        var html = handlebarsHelper("#playlists-index", {playlists: data});

        self.el.html(html);

        self.installPlaylistsIndexListeners();
      });
    };

    self.renderPlaylistsForm = function() {
      var html = handlebarsHelper("#playlists-create");

      self.el.html(html);

      self.installPlaylistsFormListeners();
    };

    self.renderPlaylistsShow = function(id) {
      var pathname = "/playlists/" + id + ".json";

      $.getJSON(pathname, function(data) {
        var html = handlebarsHelper("#playlists-show", {playlist: data});

        self.el.html(html);

        self.installPlaylistsShowListeners();
      });
    };

    // listeners

    self.installPlaylistsFormListeners = function() {
      $(".playlists-create").click(function() {
        $.post('playlists.json', $("#playlists-form").serialize(), function(data) {
          self.renderPlaylistsIndex();
        });
      });

      self.indexPlaylist();
    };

    self.installPlaylistsIndexListeners = function() {
      self.loadPlaylist();
      self.newPlaylist();
      self.showPlaylist();
    };

    self.installPlaylistsShowListeners = function() {
      self.loadPlaylist();
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
