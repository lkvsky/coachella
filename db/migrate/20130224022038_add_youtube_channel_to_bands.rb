class AddYoutubeChannelToBands < ActiveRecord::Migration
  def change
    add_column :bands, :youtube_channel, :string
  end
end
