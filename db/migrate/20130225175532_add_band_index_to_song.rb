class AddBandIndexToSong < ActiveRecord::Migration
  def change
    add_index :songs, :band_id
  end
end
