//= require coachella
Coachella.PlaylistView = function(el, playlists) {
  var self = this;

  self.el = $(el);

  // views

  self.renderPlaylistsIndex = function(playlists) {
    var html = Coachella.handlebarsHelper("#playlists-index", {playlists: playlists});
    self.el.html(html);
    self.installPlaylistsIndexListeners();
  };

  self.renderPlaylistsShow = function(id) {
    var pathname = "/playlists/" + id + ".json";

    $.getJSON(pathname, function(data) {
      var html = Coachella.handlebarsHelper("#playlists-show", {playlist: data});
      self.el.html(html);
      self.installPlaylistsShowListeners();
    });
  };

  self.renderPlaylistsEdit = function(id) {
    var pathname = "/playlists/" + id + ".json";

    $.getJSON(pathname, function(data) {
      var html = Coachella.handlebarsHelper("#playlists-edit", {playlist: data});
      self.el.html(html);
      self.installPlaylistsEditListeners();
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
    self.editPlaylist();
  };

  self.installPlaylistsEditListeners = function() {
    self.deletePlaylist();
    self.deletePlaylistSong();
    self.savePlaylist();
  };

  // listener helpers

  self.fetchAndRenderPlaylists = function() {
    $.getJSON("/playlists.json", function(data) {
      self.renderPlaylistsIndex(data);
    });
  };

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

      new Coachella.PlaylistView("#playlist");
    });
  };

  self.indexPlaylist = function() {
    $(".playlists-index").click(function() {
      new Coachella.PlaylistView("#playlist");
    });
  };

  self.loadPlaylist = function() {
    $(".load-playlist").click(function() {
      var id = $(this).attr("data-playlist-id");
      var pathname = "/playlists/" + id + ".json";

      $.getJSON(pathname, function(data) {
        new Coachella.CurrentlyPlayingView(data.songs);
      });
    });
  };

  self.savePlaylist = function() {
    $(".playlists-save").click(function() {
      var id = $(this).attr("data-playlist-id");
      var pathname = "/playlists/" + id;
      var putData = $("#playlists-update").serialize();

      $.ajax({
        url: pathname,
        type: "put",
        data: putData,
        success: function() {
          self.renderPlaylistsShow(id);
        }
      });
    });
  };

  self.editPlaylist = function() {
    $(".playlists-edit").click(function() {
      var id = $(this).attr("data-playlist-id");
      
      self.renderPlaylistsEdit(id);
    });
  };

  self.deletePlaylistSong = function() {
   $(".playlist-song-delete").click(function() {
      var songId = $(this).attr("data-song-id");
      var input = $("<input>");
      
      input.attr("name", "playlist[songs][" + songId + "]");
      input.attr("type", "hidden");
      
      $(".deleted-songs").append(input);
      $(this).closest("div.song").remove();
   });
  };

  self.initialize = (function() {
    if (playlists) {
      self.renderPlaylistsIndex(playlists);
    } else {
      self.fetchAndRenderPlaylists();
    }
  })();
};