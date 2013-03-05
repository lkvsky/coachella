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
  $.getJSON("/users.json", function(data) {
    var user;

    if (data.current_user) {
      user = new Coachella.UserModel(data.current_user);
    } else {
      user = null;
    }

    if (callback) {
      callback(user);
    }
  });
};