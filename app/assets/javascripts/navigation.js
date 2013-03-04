//= require coachella
Coachella.Navigation = function() {
  var self = this;

  self.el = $("#navigation");

  self.renderNavBar = function() {
    var html = Coachella.handlebarsHelper("#navigation-show");
    self.el.html(html);

    self.installNavListeners();
  };

  self.installNavListeners = function() {
    $("#band-section").click(function() {
      Coachella.toggleSection("#band-section", "#band");
    });
    $("#song-section").click(function() {
      Coachella.toggleSection("#song-section", "#song");
    });
    $("#playlist-section").click(function() {
      Coachella.toggleSection("#playlist-section", "#playlist");
    });
  };

  self.initialize = (function() {
    $("#band").hide();
    $("#song").hide();
    self.renderNavBar();
  })();
};