class SongDislike < ActiveRecord::Base
  attr_accessible :song_id, :user_id

  belongs_to :user
  belongs_to :song

  validates :song_id, :uniqueness => { :scope => :user_id }
end