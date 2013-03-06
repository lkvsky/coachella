//= require coachella
Coachella.UserModel = function(user) {
  var self = this;

  self.id = user.id;
  self.username = user.username;
  self.email = user.email;

  self.fetch = function(id) {
    var path = "/users/" + id + ".json";

    $.getJSON(path, function(data) {
      self.username = data.username;
      self.email = data.email;
    });
  };
};