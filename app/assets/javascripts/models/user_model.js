Coachella.UserModel = function(user) {
  var self = this;

  self.id = user.id;
  self.username = user.username;
  self.email = user.email;
  self.playlists = user.playlists;
  self.songs = {
    favoriteSongs: user.favorite_songs,
    dislikedSongs: user.disliked_songs
  };

  self.fetch = function(id) {
    var path = "/users/" + id + ".json";

    $.getJSON(path, function(data) {
      self.username = data.username;
      self.email = data.email;
      self.playlists = data.playlists;
      self.songs = {
        favorite_songs: data.favorite_songs,
        disliked_songs: data.disliked_songs
      };
    });
  };
};