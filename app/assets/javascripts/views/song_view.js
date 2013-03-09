//= require coachella
Coachella.SongView = function(el, songs) {
  var self = this;

  self.el = $(el);

  self.renderLikedSongs = function(favoriteSongs) {
    var html = Coachella.handlebarsHelper("#liked-show", {songs: favoriteSongs});

    $("#likes").html(html);
    self.removeLikeOrDislike(".destroy-like", "song_likes/");
    self.playSongs($("#likes"), favoriteSongs);
    self.playSingleSong($(".load-like-song"), favoriteSongs);

    if (Coachella.video) {
      Coachella.addSelectedSongState();
    }
  };

  self.renderDislikedSongs = function(dislikedSongs) {
    var html = Coachella.handlebarsHelper("#disliked-show", {songs: dislikedSongs});

    $("#dislikes").html(html);
    self.removeLikeOrDislike(".destroy-dislike", "song_dislikes/");
    self.playSongs($("#dislikes"), dislikedSongs);
    self.playSingleSong($(".load-hate-song"), dislikedSongs);

    if (Coachella.video) {
      Coachella.addSelectedSongState();
    }
  };

  self.removeLikeOrDislike = function(el, path) {
    $(el).click(function() {
      var id = $(this).attr("data-song-id");
      var pathname = path + id;

      $.ajax({
        url: pathname,
        type: "delete",
        success: function() {
          if (el == ".destroy-like") {
            self.fetchSongs("/song_likes.json", self.renderLikedSongs);
            self.updateFeelings(id, {like: "false"});
          } else {
            self.fetchSongs("/song_dislikes.json", self.renderDislikedSongs);
            self.updateFeelings(id, {dislike: "false"});
          }
        }
      });

      $(this).closest("div.song").remove();
    });
  };

  // utilities

  self.updateFeelings = function(id, status) {
    var playlist = Coachella.getCachedObject("playlist");

    for (var i=0; i<playlist.length; i++) {
      if (playlist[i].id === parseInt(id, 10)) {
        if (status.like) {
          playlist[i].like = status.like;
          Coachella.renderFeelingsHtml($("#on-deck div.feelings"), id, status.like, null);
        } else if (status.dislike) {
          playlist[i].dislike = status.dislike;
          Coachella.renderFeelingsHtml($("#on-deck div.feelings"), id, null, status.dislike);
        }

        Coachella.cacheObject("playlist", playlist);
        break;
      }
    }

  };

  self.fetchSongs = function(path, callback) {
    $.getJSON(path, function(data) {
      callback(data);
    });
  };

  self.playSongs = function(el, playlistSongs) {
    el.find(".load-songs").click(function() {
      new Coachella.CurrentlyPlayingView(playlistSongs);
    });
  };

  self.playSingleSong = function(el, songs) {
    el.click(function() {
      var song = [];

      for (var i=0; i<songs.length; i++) {
        if (parseInt(songs[i].id, 10) == parseInt($(this).attr("data-song-id"), 10)) {
          song.push(songs[i]);
        }
      }

      new Coachella.CurrentlyPlayingView(song);
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