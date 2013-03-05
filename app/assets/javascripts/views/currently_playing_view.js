//= require coachella
Coachella.CurrentlyPlayingView = function(playlist, user) {
  var self = this;

  self.el = $("#music-container");
  self.playlist = playlist;

  // views

  self.renderUserPrompt = function() {
    html = Coachella.handlebarsHelper("#prompt-user");
    
    $("#on-deck").html(html);
    $("#cue-playlist").click(function() {
      self.generateRandomPlaylist();
    });
  };

  self.renderUserWelcome = function(user) {
    html = Coachella.handlebarsHelper("#welcome-user", {user: user});

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

      html = Coachella.handlebarsHelper("#cued-song", {song: song});
    }

    $("#on-deck").html(html);
    self.renderFeelingsHtml();
    self.installCuedSongListeners();
  };

  self.renderPlayerShow = function() {
    var html = Coachella.handlebarsHelper("#player-show");

    self.el.html(html);
  };

  // utilitiy

  self.userPromptOrWelcome = function() {
    if (user) {
      self.renderUserWelcome(user);
    } else {
      self.renderUserPrompt();
    }
  };

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
      self.userPromptOrWelcome();
    }
  })();
};