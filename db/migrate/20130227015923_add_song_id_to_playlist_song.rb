class AddSongIdToPlaylistSong < ActiveRecord::Migration
  def change
    add_column :playlist_songs, :song_id, :integer
  end
end
