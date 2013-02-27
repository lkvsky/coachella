class User < ActiveRecord::Base
  attr_accessible :username

  has_many :playlists
  has_many :favorite_songs, :class_name => "SongLike"
  has_many :disliked_songs, :class_name => "SongDislike"
end