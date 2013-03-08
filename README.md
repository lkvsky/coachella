My Coachella
============

My Coachella is a single page web app built on Rails, AJAX, Devise/Omniauth for authentication and the YouTube JavaScript/iframe API. Templating is all done on the client side via Handlebars. I started with scripts that scraped Coachella's website to get band info for the artists, then fetched YouTube tracks for each artist based on their YouTube channels.

Users can log-in by signing up for an account and authenticating through Devise, or sign up with Facebook. The app starts with a temporary guest account. If a user signs up during his/her session, all playlists and favorite/hated songs get transferred over from the guest user to their newly created account.

The app allows users to generate random playlists, either by day of the festival or by mixing several artists of their choosers. They can edit these playlists, changing the name and removing tracks. Users can "Like" their favorite artists to create an auto-playlist of their favorite songs, or they can "Hate" songs that they never want to show up again in their playlists.

Check out the live code here: [My Coachella](http://mycoachella.herokuapp.com)




