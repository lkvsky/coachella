class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :name
      t.integer :band_id
      t.string :url

      t.timestamps
    end
  end
end
