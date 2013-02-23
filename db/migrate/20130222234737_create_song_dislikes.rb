class CreateSongDislikes < ActiveRecord::Migration
  def change
    create_table :song_dislikes do |t|
      t.integer :user_id
      t.integer :song_id

      t.timestamps
    end
  end
end
