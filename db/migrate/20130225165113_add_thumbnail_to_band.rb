class AddThumbnailToBand < ActiveRecord::Migration
  def change
    add_column :bands, :thumbnail, :string
  end
end
