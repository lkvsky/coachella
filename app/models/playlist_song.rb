class PlaylistSong < ActiveRecord::Base
  attr_accessible :playlist_id, :user_id, :song_id

  belongs_to :song
  belongs_to :playlist
end