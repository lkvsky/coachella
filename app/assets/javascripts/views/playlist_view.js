//= require coachella
Coachella.PlaylistView = function(el) {
  var self = this;

  self.el = $(el);

  // views

  self.renderPlaylistsIndex = function() {
    $.getJSON("/playlists.json", function(data) {
      var html = Coachella.handlebarsHelper("#playlists-index", {playlists: data});

      self.el.html(html);

      self.installPlaylistsIndexListeners();
    });
  };

  self.renderPlaylistsShow = function(id) {
    var pathname = "/playlists/" + id + ".json";

    $.getJSON(pathname, function(data) {
      var html = Coachella.handlebarsHelper("#playlists-show", {playlist: data});

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
        new Coachella.CurrentlyPlayingView(data.songs);
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

      new Coachella.PlaylistView("#playlist");
   });
  };

  self.initialize = (function() {
    self.renderPlaylistsIndex();
  })();
};