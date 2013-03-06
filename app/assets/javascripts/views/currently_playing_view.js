//= require coachella
Coachella.CurrentlyPlayingView = function(playlist, user) {
  var self = this;

  self.el = $("#music-container");
  //self.playlist = Coachella.getCachedObject("playlist");

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
    var playlist = Coachella.getCachedObject("playlist");

    if (self.video && !YT.PlayerState.ENDED) {
      var url = self.video.getVideoUrl().split("v=")[1];

      for (var i=0; i<playlist.length; i++) {
        if (url == playlist[i].url) {
          song = playlist[i];
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
    if (Coachella.getCachedObject("playlist")) {
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
    var playlist = Coachella.getCachedObject("playlist");

    for (var i=0; i<playlist.length; i++) {
      playerList.push(playlist[i].url);
    }

    self.video.loadPlaylist({playlist: playerList});
  };

  self.generateRandomPlaylist = function() {
    $.getJSON("/songs", function(data) {
      Coachella.cacheObject("playlist", data);

      self.loadIframe();
    });
  };

  // listeners

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
    var playlist = Coachella.getCachedObject("playlist");

    for (var i=0; i<playlist.length; i++) {
      if (playlist[i].id == songId) {
        playlist[i].like = likeStatus;
        playlist[i].dislike = dislikeStatus;

        Coachella.cacheObject("playlist", playlist);
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
    if (playlist) {
      Coachella.cacheObject("playlist", playlist);
      self.loadIframe();
    } else {
      self.userPromptOrWelcome();
    }
  })();
};