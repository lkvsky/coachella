class AddThumbnailToSong < ActiveRecord::Migration
  def change
    add_column :songs, :thumbnail, :string
  end
end
