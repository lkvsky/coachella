// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require coachella

function onYouTubeIframeAPIReady() {
  var player = new Coachella.CurrentlyPlayingView();
  var playlistCreator = new Coachella.PlaylistCreator("#playlist-creator");
  var playlist = new Coachella.PlaylistView("#playlist");
  var band = new Coachella.BandView("#band");
  var song = new Coachella.SongView("#song");
  var navigation = new Coachella.Navigation();
}

$(function() {
  $.getScript("https://www.youtube.com/iframe_api");
});
