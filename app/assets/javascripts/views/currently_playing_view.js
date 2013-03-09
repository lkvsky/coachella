//= require coachella
Coachella.CurrentlyPlayingView = function(playlist, user) {
  var self = this;

  self.el = $("#music-container");

  // views

  self.renderUserPrompt = function() {
    html = Coachella.handlebarsHelper("#prompt-user");
    
    $("#on-deck-content").html(html);
    $("#cue-playlist").click(function() {
      self.generateRandomPlaylist();
    });
  };

  self.renderUserWelcome = function(user) {
    html = Coachella.handlebarsHelper("#welcome-user", {user: user});

    $("#on-deck-content").html(html);
    $("#cue-playlist").click(function() {
      self.generateRandomPlaylist();
    });

    self.interval = setInterval(self.renderCountdown, 255);
  };

  self.renderCurrentSong = function() {
    var html;
    var song = Coachella.currentlyPlaying();

    if (Coachella.video && !YT.PlayerState.ENDED && song) {
      html = Coachella.handlebarsHelper("#cued-song", {song: song});
    }

    $("#on-deck-content").html(html);
    if (song) {
      Coachella.renderFeelingsHtml($("#on-deck div.feelings"), song.id.toString(), song.like, song.dislike);
    }
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
    if (self.interval) {
      clearInterval(self.interval);
    }

    $("#cue-playlist").remove();
    $("#music-player").css("opacity", "1");
    
    if (Coachella.getCachedObject("playlist")) {
      Coachella.video = new YT.Player('music-player', {
        events: {
          'onReady': self.startPlaylist,
          'onStateChange': self.renderCurrentSong
        }
      });
    }

    Coachella.video.addEventListener("onStateChange", function() {
      $("body").find("div.selected").removeClass("selected");
      Coachella.addSelectedSongState();
      Coachella.addSelectedBandState();
    });
  };

  self.startPlaylist = function() {
    var playerList = [];
    var playlist = Coachella.getCachedObject("playlist");

    for (var i=0; i<playlist.length; i++) {
      playerList.push(playlist[i].url);
    }

    Coachella.video.loadPlaylist({playlist: playerList});
  };

  self.generateRandomPlaylist = function() {
    $.getJSON("/songs", function(data) {
      Coachella.cacheObject("playlist", data);

      self.loadIframe();
    });
  };

  self.generateCountdown = function(weekend) {
    var weekends = {
      1: new Date(2013, 3, 12),
      2: new Date(2013, 3, 19)
    };
    var oneDay = 1000*60*60*24;
    var elapsed;

    if (weekend == 1) {
      elapsed = weekends[1] - (new Date());
    } else {
      elapsed = weekends[2] - (new Date());
    }

    var difference = new Date(elapsed);

    return {
      days: Math.floor(elapsed/oneDay),
      hours: difference.getHours(),
      minutes: difference.getMinutes(),
      seconds: difference.getSeconds()
    };
  };

  self.renderCountdown = function() {
    var wk1 = self.generateCountdown(1);
    var wk2 = self.generateCountdown(2);

    $("#weekend-one").html(wk1.days + " days, " + wk1.hours + ":" + wk1.minutes + ":" + wk1.seconds);
    $("#weekend-two").html(wk2.days + " days, " + wk2.hours + ":" + wk2.minutes + ":" + wk2.seconds);
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
      Coachella.renderFeelingsHtml($("#on-deck div.feelings"), songId.toString(), data.like, data.dislike);
      new Coachella.SongView("#song");
    });
  };

  self.postDislike = function(songId) {
    $.post("/song_dislikes", {"dislike": songId}, function(data) {
      self.updateSongAttributes(songId, data.like, data.dislike);
      Coachella.renderFeelingsHtml($("#on-deck div.feelings"), songId.toString(), data.like, data.dislike);
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