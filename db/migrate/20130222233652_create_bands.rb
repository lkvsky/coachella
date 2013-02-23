class CreateBands < ActiveRecord::Migration
  def create
    create_table :bands do |t|
      t.string :name
      t.string :genre
      t.set_time :string

      t.timestamps
    end
  end
end
