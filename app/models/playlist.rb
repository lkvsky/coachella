class Playlist < ActiveRecord::Base
  attr_accessible :user_id, :name

  belongs_to :user

  has_many :playlist_songs, :dependent => :destroy
  has_many :songs, :through => :playlist_songs
end