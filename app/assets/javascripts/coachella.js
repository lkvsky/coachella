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

  $(".discovery > div").hide();
  $(blockContent).show();
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

Coachella.renderFeelingsHtml = function(el, likeStatus, dislikeStatus) {
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