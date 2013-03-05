Coachella.UserModel = function(user) {
  var self = this;

  self.id = user.id || null;
  self.username = user.username || null;
  self.email = user.email || null;

  self.fetch = function(id) {
    var path = "/users/" + id + ".json";

    $.getJSON(path, function(data) {
      self.username = data.username;
      self.email = data.email;
    });
  };
};