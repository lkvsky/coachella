//= require coachella
Coachella.SongView = function(el, songs) {
  var self = this;

  self.el = $(el);

  self.renderLikedSongs = function(favoriteSongs) {
    var html = Coachella.handlebarsHelper("#liked-show", {songs: favoriteSongs});

    $("#likes").html(html);
    self.removeLikeOrDislike(".destroy-like", "song_likes/");
    self.playSongs(favoriteSongs);
  };

  self.renderDislikedSongs = function(dislikedSongs) {
    var html = Coachella.handlebarsHelper("#disliked-show", {songs: dislikedSongs});

    $("#dislikes").html(html);
    self.removeLikeOrDislike(".destroy-dislike", "song_dislikes/");
    self.playSongs(dislikedSongs);
  };

  self.removeLikeOrDislike = function(el, path) {
    $(el).click(function() {
      var pathname = path + $(this).attr("data-song-id");

      $.ajax({
        url: pathname,
        type: "delete"
      });

      if (el == ".destroy-like") {
        self.renderLikedSongs();
      } else {
        self.renderDislikedSongs();
      }
    });
  };

  // utilities

  self.fetchSongs = function(path, callback) {
    $.getJSON(path, function(data) {
      callback(data);
    });
  };

  self.playSongs = function(songs) {
    $(".load-songs").click(function() {
      new Coachella.CurrentlyPlayingView(songs);
    });
  };

  self.initialize = (function() {
    if (songs) {
      self.renderLikedSongs(songs.favoriteSongs);
      self.renderDislikedSongs(songs.dislikedSongs);
    } else {
      self.fetchSongs("/song_likes.json", self.renderLikedSongs);
      self.fetchSongs("/song_dislikes.json", self.renderDislikedSongs);
    }
  })();
};