//= require coachella
Coachella.PlaylistCreator = function(el) {
  var self = this;

  self.el = $(el);
  self.bands = [];

  self.renderPlaylistsForm = function() {
    var html = Coachella.handlebarsHelper("#playlists-create", {bands: self.bands});

    self.el.html(html);

    self.installPlaylistsFormListeners();

    $("#bands-select").select2({
      placeholder: "Select some bands",
      width: 'resolve'
    });
  };

  self.installPlaylistsFormListeners = function() {
    $(".playlists-create").click(function() {
      $.post('playlists.json', $("#playlists-form").serialize(), function(data) {
        new Coachella.PlaylistView("#playlist");
      }).error(function() {
        self.renderError();
        $(".error-message").html("Pick something to mix");
        $(".temp").remove();
      });
        self.renderTemp("Hold on while we mix...", "0.5");
        Coachella.toggleSection("#playlist-section", "#playlist");
    });
    self.toggleCreator();
  };

  self.renderTemp = function(message, opacity) {
    var div = $("<div>");
    div.addClass("well well-small temp");
    div.css("opacity", opacity);
    div.html(message);

    $("#playlist").append(div);
  };

  self.renderError = function() {
    var html = Coachella.handlebarsHelper("#playlists-error");
    $("#error-shell").html(html);
  };

  self.toggleCreator = function() {
    $("#playlists-new").click(function() {
      if ($("#playlist-creator").hasClass("showing")) {
        $(this).html("New Playlist");
        $("#playlist-creator").removeClass("showing");
      } else {
        $("#playlist-creator").addClass("showing");
        $(this).html("Hide Creator");
      }
    });
  };

  self.initialize = (function() {
    if (Coachella.getCachedObject("bands")) {
      self.bands = Coachella.getCachedObject("bands");
      self.renderPlaylistsForm();
    } else {
      $.getJSON("/bands.json", function(data) {
        self.bands = data;
        self.renderPlaylistsForm();
      });
    }
  })();
};