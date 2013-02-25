class SongLike < ActiveRecord::Base
  attr_accessible :song_id, :user_id

  belongs_to :song
  belongs_to :user

  validates :song_id, :uniqueness => { :scope => :user_id }
end