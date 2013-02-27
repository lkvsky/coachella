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

    self.playlist = playlist;
    self.video = null;

    self.loadIframe = function() {
      if (playlist) {
        self.video = new YT.Player('music-player', {
          events: {
            'onReady': self.startPlaylist,
            'onStateChange': self.loadNextVideo
          }
        });
      }
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
      if (playlist) {
        var songList = $("<ol>");
        var maxIter = Math.min(self.playlist.length - 1, 10);

        for (var i = 0; i<maxIter; i++) {
          var li = $("<li>");

          li.html("<strong>" + self.playlist[i].band + "</strong>: " + self.playlist[i].name);
          songList.append(li);
        }

        $("#current-playlist").html(songList);
      } else {
        $("#current-playlist").html("Pick or create a playlist!");
      }
    };

    self.initialize = (function() {
      self.renderPlaylist();
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

    self.resetPlayer = function() {
      var htmlStr = '<div id="music-player"> \
                      <div id="cue-playlist"> \
                        <div class="cue-playlist"> \
                        </div> \
                      </div> \
                    </div>';
      $("#music-container").html(htmlStr);
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
      self.deletePlaylist();
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
          self.resetPlayer();
          new CurrentlyPlayingView(data.songs);
        });
      });
    };

    self.initialize = (function() {
      self.renderPlaylistsIndex();
    })();
  }

  return {
    PlayerView: CurrentlyPlayingView,
    PlaylistCreatorView: PlaylistCreatorView,
    DiscoveryView: DiscoveryView
  };

})();

function onYouTubeIframeAPIReady() {
  var player = new Coachella.PlayerView();
  var playlistCreator = new Coachella.PlaylistCreatorView("#playlist-creator");
  var discovery = new Coachella.DiscoveryView("#discovery");
}

$(function() {
  $.getScript("https://www.youtube.com/iframe_api");
});
