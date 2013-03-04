//= require coachella
Coachella.BandView = function(el) {
  var self = this;

  self.el = $(el);

  // views

  self.renderBandsIndex = function() {
    $.getJSON('/bands.json', function(data) {
      var html = Coachella.handlebarsHelper("#bands-index", {bands: data});

      self.el.html(html);
      
      self.installBandsIndexListeners();
    });
  };

  self.renderBandsShow = function(id) {
    var pathname = '/bands/' + id + '.json';

    $.getJSON(pathname, function(data) {
      var html = Coachella.handlebarsHelper("#bands-show", {band: data});

      self.el.html(html);

      self.installBandsShowListeners();
    });
  };

  // listeners

  self.installBandsIndexListeners = function() {
    $(".bands-show").click(function() {
      var id = $(this).attr("data-band-id");

      self.renderBandsShow(id);
    });
  };

  self.installBandsShowListeners = function() {
    $(".bands-index").click(function() {

      self.renderBandsIndex();
    });
  };

  // initialize

  self.initialize = (function() {
    self.renderBandsIndex();
  })();
};