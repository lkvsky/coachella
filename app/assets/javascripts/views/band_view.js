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

      self.installBandsShowListeners(data.songs);
    });
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

      self.renderBandsIndex();
    });

    $(".load-playlist").click(function() {
      new Coachella.CurrentlyPlayingView(songs);
    });
  };

  // initialize

  self.initialize = (function() {
    self.renderBandsIndex();
  })();
};