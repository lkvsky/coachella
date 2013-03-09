//= require coachella
Coachella.BandView = function(el) {
  var self = this;

  self.el = $(el);

  // views

  self.renderBandsIndex = function(bands) {
      var html = Coachella.handlebarsHelper("#bands-index", {bands: bands});
      self.el.html(html);
      self.installBandsIndexListeners();

      if (Coachella.video) {
        self.addSelectedBandState();
      }
  };

  self.renderBandsShow = function(id) {
    var pathname = '/bands/' + id + '.json';

    $.getJSON(pathname, function(data) {
      var html = Coachella.handlebarsHelper("#bands-show", {band: data});
      self.el.html(html);
      self.installBandsShowListeners(data.songs);
      $(".floating-images").css("background-image", "url('" + data.info.thumbnail + "')");
      self.displayFeelings();

      if (Coachella.video) {
        self.addSelectedSongState();
      }
    });
  };

  // utilitiy

  self.displayFeelings = function() {
    $("div.feelings").each(function() {
      if ($(this).find(".like").attr("data-like-status") == "true") {
        $(this).find(".like").html("Unlike");
      } else {
        $(this).find(".like").html("Like");
      }

      if ($(this).find(".dislike").attr("data-dislike-status") == "true") {
        $(this).find(".dislike").html("Unhate");
      } else {
        $(this).find(".dislike").html("Hate");
      }
    });
  };

  self.fetchAndRenderBands = function() {
    if (Coachella.getCachedObject("bands")) {
      self.renderBandsIndex(Coachella.getCachedObject("bands"));
    } else {
      $.getJSON("/bands.json", function(data) {
        Coachella.cacheObject("bands", data);
        self.renderBandsIndex(data);
      });
    }
  };

  self.findCurrentSong = function() {
    var playlist = Coachella.getCachedObject("playlist");
    var song;

    if (Coachella.video) {
      var url = Coachella.video.getVideoUrl().split("v=")[1];

      for (var i=0; i<playlist.length; i++) {
        if (url == playlist[i].url) {
          song = playlist[i];
        }
      }
    }

    return song;
  };

  self.addSelectedSongState = function() {
    var song = self.findCurrentSong();

    $("body").find("div.song").each(function() {
      if (song.id.toString() == $(this).attr("data-song-id")) {
        $(this).addClass("selected");
      }
    });
  };

  self.addSelectedBandState = function() {
    var song = self.findCurrentSong();

    $("body").find("div.band").each(function() {
      if (song.band_id.toString() == $(this).attr("data-band-id")) {
        $(this).addClass("selected");
      }
    });
  };

  // listeners

  self.installBandsIndexListeners = function() {
    self.bandsShow();
    self.bandsPlay();
  };

  self.installBandsShowListeners = function(songs) {
    self.bandsIndex();
    self.bandsPlay(songs);
    self.bandsSongLike();
    self.bandsSongDislike();
    self.bandsSongPlay(songs);
  };

  // listener helpers

  self.bandsIndex = function() {
    $(".bands-index").click(function() {
      self.fetchAndRenderBands();
    });
  };

  self.bandsShow = function() {
    $(".bands-show").click(function() {
      var id = $(this).attr("data-band-id");
      self.renderBandsShow(id);
    });
  };

  self.bandsPlay = function(songs) {
    $(".load-band-playlist").click(function() {
      if (songs) {
        new Coachella.CurrentlyPlayingView(songs);
      } else {
        var id = $(this).attr("data-band-id");
        var pathname = '/bands/' + id + '.json';

        $.getJSON(pathname, function(data) {
          new Coachella.CurrentlyPlayingView(data.songs);
        });
      }
    });
  };

  self.bandsSongPlay = function(songs) {
    $(".load-band-song").click(function() {
      var song = [];

      for (var i=0; i<songs.length; i++) {
        if (parseInt(songs[i].id, 10) == parseInt($(this).attr("data-song-id"), 10)) {
          song.push(songs[i]);
        }
      }

      new Coachella.CurrentlyPlayingView(song);
    });
  };

  self.bandsSongLike = function() {
    $("div.song div.feelings").find(".like").click(function() {
      var songId = $(this).attr("data-song-id");
      self.postLike(songId);
    });
  };

  self.bandsSongDislike = function() {
    $("div.song div.feelings").find(".dislike").click(function() {
      var songId = $(this).attr("data-song-id");
      self.postDislike(songId);
    });
  };

  self.postLike = function(songId) {
    $.post("/song_likes", {"like": songId}, function(data) {
      self.updatePlaylistAttributes(songId, data);
      new Coachella.SongView("#song");
    });
  };

  self.postDislike = function(songId) {
    $.post("/song_dislikes", {"dislike": songId}, function(data) {
      self.updatePlaylistAttributes(songId, data);
      new Coachella.SongView("#song");
    });
  };

  self.updatePlaylistAttributes = function(songId, status) {
    if (Coachella.getCachedObject("playlist")) {
      var playlist = Coachella.getCachedObject("playlist");

      for (var i=0; i<playlist.length; i++) {
        if (playlist[i].id === parseInt(songId, 10)) {
          playlist[i].like = status.like;
          playlist[i].dislike = status.dislike;
          Coachella.renderFeelingsHtml($("#on-deck div.feelings"), playlist[i].toString(), status.like, status.dislike);
          Coachella.cacheObject("playlist", playlist);
        }
      }
    }

    Coachella.renderFeelingsHtml($("div#song-" + songId), songId, status.like, status.dislike);
  };

  // initialize

  self.initialize = (function() {
    self.fetchAndRenderBands();
  })();
};