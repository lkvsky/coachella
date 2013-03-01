class AddSetTimeIndexToBands < ActiveRecord::Migration
  def change
    add_index :bands, :set_time
  end
end
