class PlaylistSong < ActiveRecord::Base
  attr_accessible :playlist_id, :song_id
end