//= require coachella
Coachella.SongView = function(el) {
  var self = this;

  self.el = $(el);

  self.renderLikedSongs = function() {
    $.getJSON("/song_likes.json", function(data) {
      var html = Coachella.handlebarsHelper("#liked-show", {songs: data});

      $("#likes").html(html);
      self.removeLikeOrDislike(".destroy-like", "song_likes/");
      self.playSongs(data);
    });
  };

  self.renderDislikedSongs = function() {
    $.getJSON("/song_dislikes.json", function(data) {
      var html = Coachella.handlebarsHelper("#disliked-show", {songs: data});

      $("#dislikes").html(html);
      self.removeLikeOrDislike(".destroy-dislike", "song_dislikes/");
      self.playSongs(data);
    });
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

  self.playSongs = function(songs) {
    $(".load-songs").click(function() {
      new Coachella.CurrentlyPlayingView(songs);
    });
  };

  self.initialize = (function() {
    self.renderLikedSongs();
    self.renderDislikedSongs();
  })();
};