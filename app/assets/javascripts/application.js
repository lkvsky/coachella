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
//= require bootstrap
//= require_tree .

//required callback for YouTube script
function onYouTubeIframeAPIReady() {
  Coachella.getCurrentUser(function() {
    $("#loading").remove();
    $("#music-container").css("display", "block");
    var user;

    if (Coachella.currentUser) {
      user = Coachella.currentUser;
    }

    new Coachella.CurrentlyPlayingView(null, user);
    new Coachella.PlaylistCreator("#playlist-creator");
    new Coachella.PlaylistView("#playlist");
    new Coachella.BandView("#band");
    new Coachella.SongView("#song");
    new Coachella.Navigation();
  });
}

$(function() {
  //load typekit
  var config = {
    kitId: 'dpo6zrk',
    scriptTimeout: 3000
  };
  var h=document.getElementsByTagName("html")[0];h.className+=" wf-loading";var t=setTimeout(function(){h.className=h.className.replace(/(\s|^)wf-loading(\s|$)/g," ");h.className+=" wf-inactive"},config.scriptTimeout);var tk=document.createElement("script"),d=false;tk.src='//use.typekit.net/'+config.kitId+'.js';tk.type="text/javascript";tk.async="true";tk.onload=tk.onreadystatechange=function(){var a=this.readyState;if(d||a&&a!="complete"&&a!="loaded")return;d=true;clearTimeout(t);try{Typekit.load(config)}catch(b){}};var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(tk,s);
  //load YouTube script
  $.getScript("https://www.youtube.com/iframe_api");
});
