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

  // cross-view helpers

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

  // Player view

  function CurrentlyPlayingView(playlist) {
    var self = this;

    self.el = $("#music-container");
    self.playlist = playlist;

    // views

    self.renderPromptUserView = function() {
      html = handlebarsHelper("#prompt-user");
      
      $("#on-deck").html(html);
      $("#cue-playlist").click(function() {
        self.generateRandomPlaylist();
      });
    };

    self.renderCurrentSong = function() {
      var html, song;

      if (self.video && !YT.PlayerState.ENDED) {
        var url = self.video.getVideoUrl().split("v=")[1];

        for (var i=0; i<self.playlist.length; i++) {
          if (url == self.playlist[i].url) {
            song = self.playlist[i];
          }
        }

        html = handlebarsHelper("#cued-song", {song: song});
      }

      $("#on-deck").html(html);
      self.renderFeelingsHtml();
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
        self.postLike(songId, this);
      });

      $(".dislike").click(function() {
        var songId = $(this).attr("data-song-id");
        self.postDislike(songId, this);
      });

    };

    // listener helpers

    self.postLike = function(songId) {
      $.post("/song_likes", {"like": songId}, function(data) {
        self.updateSongAttributes(songId, data.like, data.dislike);
        self.renderFeelingsHtml();
        new Coachella.SongView("#song");
      });
    };

    self.postDislike = function(songId) {
      $.post("/song_dislikes", {"dislike": songId}, function(data) {
        self.updateSongAttributes(songId, data.like, data.dislike);
        self.renderFeelingsHtml();
        new Coachella.SongView("#song");
      });
    };

    self.updateSongAttributes = function(songId, likeStatus, dislikeStatus) {
      for (var i=0; i<self.playlist.length; i++) {
        if (self.playlist[i].id == songId) {
          self.playlist[i].like = likeStatus;
          self.playlist[i].dislike = dislikeStatus;
        }
      }

      $(".feelings").find(".like").attr("data-like-status", likeStatus);
      $(".feelings").find(".dislike").attr("data-dislike-status", dislikeStatus);
    };

    self.renderFeelingsHtml = function() {
      if ($(".like").attr("data-like-status") == "true") {
        $(".like").html("Unlike");
      } else {
        $(".like").html("Like");
      }

      if ($(".dislike").attr("data-dislike-status") == "true") {
        $(".dislike").html("Unhate");
      } else {
        $(".dislike").html("Hate");
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

  function BandView(el) {
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

  // view for playlist generator

  function PlaylistCreator(el) {
    var self = this;

    self.el = $(el);
    self.bands = [];

    self.renderPlaylistsForm = function() {
      var html = handlebarsHelper("#playlists-create", {bands: self.bands});

      self.el.html(html);

      self.installPlaylistsFormListeners();

      $("#bands-select").select2({
        placeholder: "Select some bands",
        width: 'resolve'
      });
    };

    self.installPlaylistsFormListeners = function() {
      $(".playlists-create").click(function() {
        $.post('playlists.json', $("#playlists-form").serialize(), function(data) {
          new Coachella.PlaylistView("#playlist");
        }).error(function() {
          $("#temp").html("Oops! Try that again...");
        });
          self.renderTemp("Hold on while we mix...", "0.5");
          Navigation.toggleSection("#playlist-section", "#playlist");
      });
    };

    self.renderTemp = function(message, opacity) {
      var div = $("<div>");
      div.attr("id", "temp");
      div.addClass("well well-small");
      div.css("opacity", opacity);
      div.html(message);

      $("#playlist").append(div);
    };

    self.initialize = (function() {
      $.getJSON("/bands.json", function(data) {
        self.bands = data;
        self.renderPlaylistsForm();
      });
    })();
  }

  // views for playlist discovery

  function PlaylistView(el) {
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

    self.renderPlaylistsShow = function(id) {
      var pathname = "/playlists/" + id + ".json";

      $.getJSON(pathname, function(data) {
        var html = handlebarsHelper("#playlists-show", {playlist: data});

        self.el.html(html);

        self.installPlaylistsShowListeners();
      });
    };

    // listeners

    self.installPlaylistsIndexListeners = function() {
      self.loadPlaylist();
      self.showPlaylist();
    };

    self.installPlaylistsShowListeners = function() {
      self.loadPlaylist();
      self.indexPlaylist();
      self.deletePlaylist();
      self.deletePlaylistSong();
    };

    // listener helpers

    self.showPlaylist = function() {
      $(".playlists-show").click(function() {
        var id = $(this).attr("data-playlist-id");

        self.renderPlaylistsShow(id);
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

    self.deletePlaylistSong = function() {
     $(".playlist-song-delete").click(function() {
        var songId = $(this).attr("data-song-id");
        var playlistId = $(this).closest(".playlist-songs").attr("data-playlist-id");

        $.ajax({
          url: "/playlists/" + playlistId,
          type: "put",
          data: {id: playlistId, song: songId}
        });

        $(this).closest("div").remove();
     });
    };

    self.initialize = (function() {
      self.renderPlaylistsIndex();
    })();
  }

  // view for songs

  function SongView(el) {
    var self = this;

    self.el = $(el);

    self.renderLikedSongs = function() {
      $.getJSON("/song_likes.json", function(data) {
        var html = handlebarsHelper("#liked-show", {songs: data});

        $("#likes").html(html);
        self.removeLikeOrDislike(".destroy-like", "song_likes/");
      });
    };

    self.renderDislikedSongs = function() {
      $.getJSON("/song_dislikes.json", function(data) {
        var html = handlebarsHelper("#disliked-show", {songs: data});

        $("#dislikes").html(html);
        self.removeLikeOrDislike(".destroy-dislike", "song_dislikes/");
      });
    };

    self.removeLikeOrDislike = function(el, path) {
      $(el).click(function() {
        var pathname = path + $(this).attr("data-song-id");

        $.ajax({
          url: pathname,
          type: "delete"
        });

        $(this).parent().remove();

      });
    };

    self.initialize = (function() {
      self.renderLikedSongs();
      self.renderDislikedSongs();
    })();
  }

  // view for navigation

  function Navigation() {
    var self = this;

    self.el = $("#navigation");

    self.renderContentNav = function() {
      var html = handlebarsHelper("#navigation-show");
      self.el.html(html);

      $("#playlist").hide();
      $("#song").hide();

      self.installNavListeners();
    };

    self.installNavListeners = function() {
      $("#band-section").click(function() {
        Navigation.toggleSection("#band-section", "#band");
      });
      $("#song-section").click(function() {
        Navigation.toggleSection("#song-section", "#song");
      });
      $("#playlist-section").click(function() {
        Navigation.toggleSection("#playlist-section", "#playlist");
      });
    };

    self.initialize = (function() {
      self.renderContentNav();
    })();
  }

  Navigation.toggleSection = function(tab, blockContent) {
    $("#content-nav li").removeClass("active");
    $(tab).closest("li").addClass("active");

    $(".discovery > div").hide();
    $(blockContent).show();
  };

  return {
    CurrentlyPlayingView: CurrentlyPlayingView,
    PlaylistCreator: PlaylistCreator,
    PlaylistView: PlaylistView,
    BandView: BandView,
    SongView: SongView,
    Navigation: Navigation
  };

})();

function onYouTubeIframeAPIReady() {
  var player = new Coachella.CurrentlyPlayingView();
  var playlistCreator = new Coachella.PlaylistCreator("#playlist-creator");
  var playlist = new Coachella.PlaylistView("#playlist");
  var band = new Coachella.BandView("#band");
  var song = new Coachella.SongView("#song");
  var navigation = new Coachella.Navigation();
}

$(function() {
  $.getScript("https://www.youtube.com/iframe_api");
});
