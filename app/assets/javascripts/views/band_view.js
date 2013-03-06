//= require coachella
Coachella.BandView = function(el) {
  var self = this;

  self.el = $(el);

  // views

  self.renderBandsIndex = function(bands) {
      var html = Coachella.handlebarsHelper("#bands-index", {bands: bands});
      self.el.html(html);
      self.installBandsIndexListeners();
  };

  self.renderBandsShow = function(id) {
    var pathname = '/bands/' + id + '.json';

    $.getJSON(pathname, function(data) {
      var html = Coachella.handlebarsHelper("#bands-show", {band: data});
      self.el.html(html);
      self.installBandsShowListeners(data.songs);
    });
  };

  // utilitiy

  self.fetchAndRenderBands = function() {
    if (Coachella.getCachedObject("bands")) {
      self.renderBandsIndex(Coachella.getCachedObject("bands"));
    } else {
      $.getJSON("/bands.json", function(data) {
        Coachella.cacheObject("bands", data);
        self.renderBandsIndex(data);
      });
    }
  };

  // listeners

  self.installBandsIndexListeners = function() {
    $(".bands-show").click(function() {
      var id = $(this).attr("data-band-id");
      self.renderBandsShow(id);
    });

    $(".load-playlist").click(function() {
      var id = $(this).attr("data-band-id");
      var pathname = '/bands/' + id + '.json';

      $.getJSON(pathname, function(data) {
        new Coachella.CurrentlyPlayingView(data.songs);
      });
    });
  };

  self.installBandsShowListeners = function(songs) {
    $(".bands-index").click(function() {
      self.fetchAndRenderBands();
    });

    $(".load-playlist").click(function() {
      new Coachella.CurrentlyPlayingView(songs);
    });
  };

  // initialize

  self.initialize = (function() {
    self.fetchAndRenderBands();
  })();
};