var Coachella = function() {};

// utility functions

Coachella.handlebarsHelper = function(el, obj) {
  var html;
  var source = $(el).html();
  var template = Handlebars.compile(source);

  if (obj) {
    html = template(obj);
  } else {
    html = template();
  }

  return html;
};

Coachella.toggleSection = function(tab, blockContent) {
  $("#content-nav li").removeClass("active");
  $(tab).closest("li").addClass("active");

  if (tab == "#home-page") {
    $("#content-nav li").removeClass("active");
  }

  $(".discovery > div").hide();
  $(blockContent).show();
};

Coachella.currentlyPlaying = function() {
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

Coachella.addSelectedSongState = function() {
  var song = Coachella.currentlyPlaying();

  $("body").find("div.song").each(function() {
    if (song.id.toString() == $(this).attr("data-song-id")) {
      $(this).addClass("selected");
    }
  });
};

Coachella.addSelectedBandState = function() {
  var song = Coachella.currentlyPlaying();

  $("body").find("div.band").each(function() {
    if (song.band_id.toString() == $(this).attr("data-band-id")) {
      $(this).addClass("selected");
    }
  });
};

Coachella.getCurrentUser = function(callback) {
  $.getJSON("/users/current.json", function(data) {
    if (data.current_user) {
      Coachella.currentUser = new Coachella.UserModel(data.current_user);
    } else {
      Coachella.currentUser = null;
    }

    if (callback) {
      callback();
    }
  });
};

Coachella.renderFeelingsHtml = function(el, id, likeStatus, dislikeStatus) {
  if (el.find(".like").attr("data-song-id") == id) {
    if (likeStatus) {
      el.find(".like").attr("data-like-status", likeStatus);

      if (el.find(".like").attr("data-like-status") == "true") {
        el.find(".like").html("Unlike");
      } else {
        el.find(".like").html("Like");
      }
    }

    if (dislikeStatus) {
      el.find(".dislike").attr("data-dislike-status", dislikeStatus);

      if (el.find(".dislike").attr("data-dislike-status") == "true") {
        el.find(".dislike").html("Unhate");
      } else {
        el.find(".dislike").html("Hate");
      }
    }
  }
};

Coachella.cacheObject = function(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
};

Coachella.getCachedObject = function(key) {
  if (typeof(localStorage.getItem(key)) !== undefined) {
    return JSON.parse(localStorage.getItem(key));
  } else {
    return null;
  }
};