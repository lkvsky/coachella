class SongLike < ActiveRecord::Base
  attr_accessible :song_id, :user_id
end