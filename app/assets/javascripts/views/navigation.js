//= require coachella
Coachella.Navigation = function() {
  var self = this;

  self.el = $("#navigation");

  self.renderNavBar = function() {
    var html = Coachella.handlebarsHelper("#navigation-show");
    self.el.html(html);

    self.installNavListeners();
    self.renderNewSession();
  };

  self.renderNewSession = function() {
    var html = Coachella.handlebarsHelper("#session-new");
    $("#form-content").html(html);

    $(".user-new").click(function() {
      self.renderNewUser();
    });

    self.formHandling();
  };

  self.renderNewUser = function() {
    var html = Coachella.handlebarsHelper("#user-new");
    $("#form-content").html(html);

    $(".session-new").click(function() {
      self.renderNewSession();
    });

    self.formHandling();
  };

  self.installNavListeners = function() {
    $("#home-page").click(function() {
      Coachella.toggleSection("#home-page", "#band");
    });
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

  self.formHandling = function() {
    $(".registration-form").on("ajax:error", function(event, xhr, status) {
      $(".error").show().html(xhr.responseText);
    });
    $(".registration-form").on("ajax:success", function() {
      $("#registration").modal("hide");
      window.location.reload();
    });
  };

  self.initialize = (function() {
    $("#playlist").hide();
    $("#song").hide();
    self.renderNavBar();
  })();
};